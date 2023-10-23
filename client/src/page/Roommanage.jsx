import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from "../components/Sidebar";
import './RoomGrid.css'; // เพิ่มไฟล์ CSS สำหรับผังห้อง

const Roommanage = () => {
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://190.92.220.17:7000/api/room');
      console.log(response.data);

      // เรียงข้อมูลตามเลขห้องก่อนแสดงผล
      const sortedData = response.data.sort((a, b) => a.room_number - b.room_number);

      setData(sortedData);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const renderRoomsByBranch = (branch) => {
    return data
      .filter((room) => room.room_branch === branch)
      .map((item, index) => (
        <div key={index} className={`room ${item.room_status === '1' ? 'room-active' : 'room-inactive'}`}>
          <p>{item.room_number}</p>
          <p>สถานะ: {item.room_status === '1' ? 'Active' : 'Inactive'}</p>
          <p>รูปแบบห้อง: {item.room_type}</p>
          <button onClick={() => changeRoomStatus(item.room_id, item.room_number, item.room_branch, item.room_type, item.room_status)}>
            เปลี่ยนสถานะ
          </button>
        </div>
      ));
  };

  const branches = [...new Set(data.map((room) => room.room_branch))];
  branches.sort(); // เรียงตามอักษร (alphabetical order)

  // ฟังก์ชันสำหรับเปลี่ยนสถานะห้อง
  const changeRoomStatus = (idRoom, numberRoom, branchRoom, typeRoom, statusRoom) => {
    let new_status;
    if (statusRoom === "0") {
      new_status = "1";
    } else {
      new_status = "0";
    }

    // สร้างข้อมูลที่คุณต้องการส่งใน POST request
    const postData = {
      roomId: idRoom,
      roomNumber: numberRoom,
      roomBranch: branchRoom,
      roomType: typeRoom,
      roomStatus: new_status
    };

    // URL ของ API ที่ใช้สำหรับเปลี่ยนสถานะห้อง
    const apiUrl = 'http://190.92.220.17:7000/api/room';

    axios.post(apiUrl, postData)
      .then(response => {
        // หลังจากสำเร็จในการเปลี่ยนสถานะห้อง
        if (response) {
          console.log('สถานะห้องถูกเปลี่ยนแล้ว');
          fetchData();
        }
      })
      .catch(error => {
        console.error('เกิดข้อผิดพลาดในการเรียกใช้ API:', error);
      });
  };

  return (
    <>
    <Sidebar/>
    <div className="room-manage">
      <h2>ผังห้อง</h2>
      {branches.map((branch, index) => (
        <div key={index}>
          <h3>สาขา: {branch}</h3>
          <div className="room-grid">{renderRoomsByBranch(branch)}</div>
        </div>
      ))}
    </div>
    </>
  );
};

export default Roommanage;
