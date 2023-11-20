// TicketCard.js
import React from 'react'

const TicketCard = ({ ticket }) => (
  <div className="ticket-card">
    <h4 className='card-id'>{ticket.id}</h4>
    <h5>{ticket.title}</h5>
  </div>
)

export default TicketCard
