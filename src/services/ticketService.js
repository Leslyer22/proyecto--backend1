
import { TicketDAO } from "../dao/ticketDao.js";

class TicketService {
  constructor(dao) {
    this.ticketDAO = dao;
  }

  async createTicket(data) {
    return await this.ticketDAO.createTicket(data);
  }
}

export const ticketService = new TicketService(TicketDAO);
