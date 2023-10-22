import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <nav id="sidebar" className="bg-lightborder">
      <div className="position-fixed">
        <ul className="list-unstyled">
        <li>
            <Link className='nav' to="/home">
              Home
            </Link>
          </li>
          <li>
            <Link className='nav' to="/usermanage">
               ผู้จอง
            </Link>
          </li>
          <li>
            <Link className='nav' to="/roommanage">
              ห้องพัก
            </Link>
          </li>
          <li>
            <Link className='nav' to="/roomstatus">
              สถานะห้อง
            </Link>
          </li>
          <li>
            <Link className='navv' to="/login">
              ออกจากระบบ
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
