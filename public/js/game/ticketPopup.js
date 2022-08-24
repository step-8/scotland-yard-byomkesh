const createTicket = (ticket, fn) => {
  const ticketName = new Element('a')
    .add('href', '#')
    .add('id', ticket)
    .addEvent('click', () => fn(ticket));

  const ext = ticket === 'ferries' ? '.jpeg' : '.svg';

  const icon = new Element('img')
    .add('src', `/images/${ticket}${ext}`);

  ticketName.append(icon.html);
  return ticketName.html;
};

const removeTicketPopup = () => {
  const ticketPopup = query('.ticket-popup');

  ticketPopup && ticketPopup.remove();
};

const updateTickets = (tickets, fn) => {
  const ticketPopup = query('.ticket-popup');
  const ticketButtons = tickets.map((ticket) =>
    createTicket(ticket, fn));

  ticketPopup.replaceChildren(...ticketButtons);

  const statsEle = query('.stats');
  statsEle.prepend(ticketPopup);
};

const createTicketPopup = (tickets, fn) => {
  const ticketPopup = new Element('div')
    .addClass('ticket-popup')
    .addClass('vertical-flex');

  const ticketButtons = tickets.map((ticket) =>
    createTicket(ticket, fn));

  ticketPopup.replace(...ticketButtons);

  const statsEle = query('.stats');
  statsEle.prepend(ticketPopup.html);
};
