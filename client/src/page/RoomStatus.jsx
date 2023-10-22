import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from "../components/Sidebar";
import axios from 'axios';
import './RoomStatus.css';

const RoomStatus = () => {
  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all'); // เริ่มต้นแสดงทุกสถานะ
  const [selectedBranch, setSelectedBranch] = useState('all'); // เริ่มต้นแสดงทุกสาขา

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://190.92.220.17:7000/api/booking');
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

 // const handleChangeStatus = async (id, newStatus) => {
 //   try {
 //     const updateResponse = await axios.post('http://190.92.220.17:7000/api/booking', {
 //       id: id,
 //       status: newStatus === 0 ? 1 : 0, // สลับสถานะ
 //     });
 //
 //     console.log(updateResponse.data);
 //
 //     fetchData(); // ดึงข้อมูลใหม่หลังการอัปเดตสถานะ
 //   } catch (error) {
 //     console.error('Error updating status:', error);
 //   }
 // };

  const filterData = () => {
    let filteredData = data;

    if (selectedStatus !== 'all') {
      filteredData = filteredData.filter((item) => item.status_booking === (selectedStatus === 'confirmed' ? 1 : 0));
    }

    if (selectedBranch !== 'all') {
      filteredData = filteredData.filter((item) => item.branch === parseInt(selectedBranch));
    }

    return filteredData;
  };

  const editBooking = (id, status) => {
    // ทำการแก้ไขการจองที่มี id ด้วยข้อมูลใหม่และสถานะ
    const updatedData = data.map((item) => {
      if (item.booking_id === id) {
        // ทำการเปลี่ยนสถานะเมื่อต้องการแก้ไข
        item.status_booking = status === 0 ? 1 : 0;
      }
      return item;
    });

    // ส่งข้อมูลไปยัง API หรือเซิร์ฟเวอร์ของคุณ
     axios.post('http://190.92.220.17:7000/api/booking', updatedData)
       .then((response) => {
         console.log('อัปเดตสถานะเรียบร้อย', response);
       })
       .catch((error) => {
         console.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ', error);
       });

    // อัปเดตข้อมูลในสถานะ
    setData(updatedData);
  };

  return (
    <>
      <Sidebar />
      <div className="room-status-container">
        <h1 className="status-heading">สถานะการจองห้อง</h1>
        <label className="status-label">สถานะการจอง:</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-select"
        >
          <option value="all">รวม</option>
          <option value="confirmed">ยืนยัน</option>
          <option value="unconfirmed">รอยืนยัน</option>
        </select>
        <label className="branch-label">สาขา:</label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="branch-select"
        >
          <option value="all">รวม</option>
          <option value="1">สาขา 1</option>
          <option value="2">สาขา 2</option>
          {/* เพิ่มตามจำนวนสาขาที่คุณมี */}
        </select>
        <ul className="room-list">
          {filterData().map((item, index) => (
            <li key={index} className="room-item">
              <strong className="room-info">ชื่อ:</strong> {item.name}<br />
              <strong className="room-info">จำนวนห้อง:</strong> {item.room}<br />
              <strong className="room-info">Room Style:</strong> {item.roomstyle}<br />
              <strong className="room-info">Check In:</strong> {item.check_in}<br />
              <strong className="room-info">Check out:</strong> {item.check_out}<br />
              <strong className="room-info">สาขา:</strong> {item.branch}<br />
              <strong className="room-info">สถานะ:</strong> {item.status_booking === 0 ? 'รอยืนยัน' : 'ยืนยัน'}<br />
              <button onClick={() => editBooking(item.booking_id, item.status_booking)} className="confirm-button">Confirm</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default RoomStatus;
