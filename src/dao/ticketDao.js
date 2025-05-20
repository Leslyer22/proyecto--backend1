
import { ticketModel } from "../models/ticket.model.js";

export class TicketDAO {
  static async createTicket(ticketData) {
    return ticketModel.create(ticketData);
  }
}

