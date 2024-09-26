import { Logger } from '@nestjs/common';

export class MySqlErrorsExceptions {
  private readonly logger = new Logger();

  public async handleDbExceptions(error: any): Promise<string> {
    this.logger.error(error);
    if (error.code === '23505')
      return `ATENCIÓN, se están repitiendo valores en campos que son de tipo único, revise. ${error.detail}`;

    return error.detail;
  }
}