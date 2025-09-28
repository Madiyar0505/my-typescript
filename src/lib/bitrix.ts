// Битрикс24 API интеграция
export interface BitrixContact {
  ID: string;
  NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  PHONE: string;
}

export interface BitrixDeal {
  ID: string;
  TITLE: string;
  OPPORTUNITY: string;
  CURRENCY_ID: string;
  DATE_CREATE: string;
  STAGE_ID: string;
  STAGE_DESCRIPTION: string;
}

interface BitrixResponse<T> {
  result: T;
  error?: {
    error: string;
    error_description: string;
  };
  total?: number;
  time?: Record<string, unknown>;
}

export class BitrixAPI {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  private buildMethodUrl(method: string): string {
    const base = this.webhookUrl.replace(/\/$/, '');
    return `${base}/${method}.json`;
  }

  private async call<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const url = this.buildMethodUrl(method);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Bitrix API request failed with status ${response.status}`);
      }

      const data: BitrixResponse<T> = await response.json();

      if (data.error) {
        throw new Error(`Bitrix API Error: ${data.error.error_description}`);
      }

      return data.result;
    } catch (error) {
      console.error(`Error calling Bitrix method '${method}':`, error);
      throw error; // Пробрасываем ошибку для обработки на верхнем уровне
    }
  }

  async createContact(login: string, email: string): Promise<BitrixContact | null> {
    try {
      const result = await this.call<number>('crm.contact.add', {
        fields: {
          NAME: login,
          EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
          OPENED: 'Y',
          TYPE_ID: 'CLIENT',
          SOURCE_ID: 'WEB'
        }
      });

      if (result) {
        return {
          ID: result.toString(),
          NAME: login,
          LAST_NAME: '',
          EMAIL: email,
          PHONE: ''
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getDeals(): Promise<BitrixDeal[]> {
    try {
      const deals = await this.call<BitrixDeal[]>('crm.deal.list', {
        select: ['ID', 'TITLE', 'OPPORTUNITY', 'CURRENCY_ID', 'DATE_CREATE', 'STAGE_ID', 'STAGE_DESCRIPTION'],
        order: { 'DATE_CREATE': 'DESC' }
      });
      return deals || [];
    } catch (error) {
      return [];
    }
  }

  async updateDealStage(dealId: string, stageId: string): Promise<boolean> {
    try {
      const result = await this.call<boolean>('crm.deal.update', {
        id: dealId,
        fields: {
          STAGE_ID: stageId
        }
      });
      return !!result;
    } catch (error) {
      return false;
    }
  }

  // Fetch deals for a specific contact (user)
  async listDealsByContact(contactId: string, options?: {
    start?: number;
    select?: string[];
    order?: Record<string, 'ASC' | 'DESC'>;
  }): Promise<BitrixDeal[]> {
    try {
      const deals = await this.call<BitrixDeal[]>('crm.deal.list', {
        filter: { CONTACT_ID: contactId },
        order: options?.order || { DATE_CREATE: 'DESC' },
        select: options?.select || ['ID', 'TITLE', 'OPPORTUNITY', 'CURRENCY_ID', 'DATE_CREATE', 'STAGE_ID', 'STAGE_DESCRIPTION'],
        start: options?.start ?? 0,
      });
      return deals || [];
    } catch (error) {
      return [];
    }
  }

  // Get single deal by ID
  async getDeal<T = any>(dealId: string): Promise<T | null> {
    try {
      const deal = await this.call<T>('crm.deal.get', { id: dealId });
      return deal || null;
    } catch (error) {
      return null;
    }
  }

  // Get product rows for a deal
  async getDealProductRows(dealId: string): Promise<any[]> {
    try {
      const rows = await this.call<any[]>('crm.deal.productrows.get', { id: dealId });
      return rows || [];
    } catch (error) {
      return [];
    }
  }

  // Create a new deal
  async addDeal(fields: Record<string, any>): Promise<string | null> {
    try {
      const result = await this.call<number>('crm.deal.add', { fields });
      return result ? String(result) : null;
    } catch (error) {
      return null;
    }
  }

  // Set product rows to a deal
  async setDealProductRows(dealId: string, rows: any[]): Promise<boolean> {
    try {
      const result = await this.call<boolean>('crm.deal.productrows.set', { id: dealId, rows });
      return !!result;
    } catch (error) {
      return false;
    }
  }
}

// Создаем экземпляр API (URL нужно будет настроить)
export const bitrixAPI = new BitrixAPI(process.env.BITRIX_WEBHOOK_URL || '');

const formatAmount = (amount: string, currency: string) => {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('kz-KZ', {
    style: 'currency',
    currency: currency === 'KZT' ? 'KZT' : 'RUB', // RUB орнына KZT тексеру
    minimumFractionDigits: 0
  }).format(numAmount);
};
