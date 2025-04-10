import moment from "moment";
import randomUserAgent from "random-useragent";
import { PriceResult } from "../models/price.model";

type APIResponse = {
  status: string;
  message: string;
  data: {
    priceList: Array<{
      id: string;
      hargaJual: string;
      hargaBeli: string;
      lastUpdate: string;
    }>;
    xAxis: Array<{
      lastUpdate: string;
    }>;
    yAxis: Array<{
      hargaBeli: string;
    }>;
  };
};

class PegadaianService {
  async getPrice(): Promise<PriceResult> {
    // Fetch API
    const response = await fetch("https://digital.pegadaian.co.id/get-harga", {
      next: { revalidate: 60 },
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: "https://digital.pegadaian.co.id",
        "User-Agent": randomUserAgent.getRandom(),
      },
      body: JSON.stringify({ interval: 1, tipe: "beli" }),
    });
    if (!response.ok) throw new Error("Failed to fetch");

    // Get data
    const data: APIResponse = await response.json();
    if (data.data.priceList.length == 0) throw new Error("Data is empty");

    // Add data to database
    return {
      buy: parseInt(data.data.priceList[0].hargaBeli) * 100,
      sell: parseInt(data.data.priceList[0].hargaJual) * 100,
      updatedAt: moment
        .utc(data.data.priceList[0].lastUpdate)
        .utcOffset(7, true)
        .toDate(),
    };
  }
}

export default PegadaianService;
