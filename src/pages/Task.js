// Task.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'
import TicketCard from '../components/TicketCard'


const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment'



const priorityMap = {
  4: 'Urgent',
  3: 'High',
  2: 'Medium',
  1: 'Low',
  0: 'No priority',
}
const Task = () => {
  const [tickets, setTickets] = useState([])
  const [displayOptions, setDisplayOptions] = useState(false)

  const [groupingOption, setGroupingOption] = useState(
    localStorage.getItem('groupingOption') || 'status',
  )
  const [sortOption, setSortOption] = useState(
    localStorage.getItem('sortOption') || 'priority',
  )
  const mapPriorityName = (priority) => {
    return priorityMap[priority]
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    localStorage.setItem('groupingOption', groupingOption)
  }, [groupingOption])

  useEffect(() => {
    localStorage.setItem('sortOption', sortOption)
  }, [sortOption])

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL)
      setTickets(response.data.tickets)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const groupTickets = () => {
    switch (groupingOption) {
      case 'status':
        return groupByStatus()
      case 'user':
        return groupByUser()
      case 'priority':
        return groupByPriority()
      default:
        return tickets
    }
  }

  const groupByStatus = () => {
    const grouped = {}
    tickets.forEach((ticket) => {
      const status = ticket.status
      if (!grouped[status]) {
        grouped[status] = []
      }
      grouped[status].push(ticket)
    })
    return Object.values(grouped)
  }

  const groupByUser = () => {
    const grouped = {}
    tickets.forEach((ticket) => {
      const user = ticket.userId
      if (!grouped[user]) {
        grouped[user] = []
      }
      grouped[user].push(ticket)
    })
    return Object.values(grouped)
  }

  const groupByPriority = () => {
    const grouped = {}
    tickets.forEach((ticket) => {
      const priority = ticket.priority
      if (!grouped[priority]) {
        grouped[priority] = []
      }
      grouped[priority].push(ticket)
    })

    return Object.values(grouped)
  }
  const sortTickets = (groupedTickets) => {
    const sortedGroupedTickets = groupedTickets.map((ticket) => {
      return {
        tickets: Array.isArray(ticket)
          ? ticket.sort((a, b) => {
              switch (sortOption) {
                case 'priority':
                  return b.priority - a.priority
                case 'title':
                  return a.title.localeCompare(b.title)
                default:
                  return 0
              }
            })
          : [],
      }
    })

    return sortedGroupedTickets
  }

  const handleDisplay = () => {
    setDisplayOptions(true)
  }

  const groupedTickets = groupTickets()
  const sortedTicket = sortTickets(groupedTickets)
  console.log(sortedTicket)
  return (
    <div className="Task">
      <div>
        <button onClick={handleDisplay}>Display</button>
        {displayOptions && (
          <div className="filter-card">
            <label>
              Grouping:
              <select
                onChange={(e) => setGroupingOption(e.target.value)}
                value={groupingOption}
              >
                <option value="status">By Status</option>
                <option value="user">By User</option>
                <option value="priority">By Priority</option>
              </select>
            </label>
            <label className={styled.label}>
              Ordering:
              <select
                onChange={(e) => setSortOption(e.target.value)}
                value={sortOption}
              >
                <option value="priority">Sort by Priority</option>
                <option value="title">Sort by Title</option>
              </select>
            </label>
          </div>
        )}
      </div>
      <div className="kanban-board">
        {sortedTicket.map((group) => (
          <div className="kanban">
            {groupingOption === 'status' && <h3>{group.tickets[0].status}</h3>}
            {groupingOption === 'priority' && (
              <h3>{mapPriorityName(group.tickets[0].priority)}</h3>
            )}
            <div className="board">
              {group.tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Task
