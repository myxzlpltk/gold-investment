import moment from 'moment';
import randomUserAgent from 'random-useragent';
import { PriceResult } from '../models/price.model';

type APIResponse = {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    buying_rate: number;
    selling_rate: number;
    updated_at: string;
  };
};

class TreasuryService {
  async getPrice(): Promise<PriceResult> {
    // Fetch API
    const response = await fetch(
      'https://api.treasury.id/api/v1/antigrvty/gold/rate',
      {
        next: { revalidate: 60 },
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Origin: 'https://web.treasury.id',
          'User-Agent': randomUserAgent.getRandom(),
        },
      },
    );
    if (!response.ok) throw new Error('Data is empty');

    // Get data
    const data: APIResponse = await response.json();

    // Add data to database
    return {
      buy: Math.round(data.data.buying_rate),
      sell: Math.round(data.data.selling_rate),
      updatedAt: moment.utc(data.data.updated_at).utcOffset(7, true).toDate(),
    };
  }
}

export default TreasuryService;
