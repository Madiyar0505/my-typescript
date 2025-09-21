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

export class BitrixAPI {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async createContact(login: string, email: string): Promise<BitrixContact | null> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cmd: 'crm.contact.add',
          fields: {
            NAME: login,
            EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
            OPENED: 'Y',
            TYPE_ID: 'CLIENT',
            SOURCE_ID: 'WEB'
          }
        })
      });

      const data = await response.json();
      
      if (data.result) {
        return {
          ID: data.result.toString(),
          NAME: login,
          LAST_NAME: '',
          EMAIL: email,
          PHONE: ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error creating Bitrix contact:', error);
      return null;
    }
  }

  async getDeals(): Promise<BitrixDeal[]> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cmd: 'crm.deal.list',
          select: ['ID', 'TITLE', 'OPPORTUNITY', 'CURRENCY_ID', 'DATE_CREATE', 'STAGE_ID', 'STAGE_DESCRIPTION'],
          filter: { '>OPPORTUNITY': 0 },
          order: { 'DATE_CREATE': 'DESC' }
        })
      });

      const data = await response.json();
      
      if (data.result) {
        return data.result.map((deal: Record<string, unknown>) => ({
          ID: deal.ID as string,
          TITLE: (deal.TITLE as string) || `Сделка #${deal.ID}`,
          OPPORTUNITY: deal.OPPORTUNITY as number,
          CURRENCY_ID: (deal.CURRENCY_ID as string) || 'RUB',
          DATE_CREATE: deal.DATE_CREATE as string,
          STAGE_ID: deal.STAGE_ID as string,
          STAGE_DESCRIPTION: deal.STAGE_DESCRIPTION as string
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching Bitrix deals:', error);
      return [];
    }
  }

  async updateDealStage(dealId: string, stageId: string): Promise<boolean> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cmd: 'crm.deal.update',
          id: dealId,
          fields: {
            STAGE_ID: stageId
          }
        })
      });

      const data = await response.json();
      return !!data.result;
    } catch (error) {
      console.error('Error updating deal stage:', error);
      return false;
    }
  }
}

// Создаем экземпляр API (URL нужно будет настроить)
export const bitrixAPI = new BitrixAPI(process.env.BITRIX_WEBHOOK_URL || '');
