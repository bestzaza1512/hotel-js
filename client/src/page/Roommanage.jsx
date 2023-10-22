import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import axios from 'axios';
import './Roommanage.css';
import './RoomGrid.css'; // เพิ่มไฟล์ CSS สำหรับผังห้อง
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Roommanage = () => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://190.92.220.17:7000/api/room');
        console.log(response.data);

        // เรียงข้อมูลตามเลขห้องก่อนแสดงผล
        const sortedData = response.data.sort((a, b) => a.room_number - b.room_number);

        setData(sortedData);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    };

    fetchData();
  }, []);

  // สร้างออบเจกต์เพื่อแยกข้อมูลตามสาขา
  const roomDataByBranch = {};
  data.forEach((item) => {
    const branch = item.room_branch;
    if (!roomDataByBranch[branch]) {
      roomDataByBranch[branch] = [];
    }
    roomDataByBranch[branch].push(item);
  });

  // ฟังก์ชันสำหรับเปลี่ยนสถานะห้อง
  const changeRoomStatus = (roomId) => {
    // สร้างข้อมูลที่คุณต้องการส่งใน POST request
    const postData = {
      room_id: roomId, // หมายเลขห้องที่คุณต้องการเปลี่ยนสถานะ
      new_status: 'new_status_value' // สถานะใหม่ที่คุณต้องการตั้งค่า
    };

    // URL ของ API ที่ใช้สำหรับเปลี่ยนสถานะห้อง
    const apiUrl = 'http://190.92.220.17:7000/api/room';

    axios.post(apiUrl, postData)
      .then(response => {
        // หลังจากสำเร็จในการเปลี่ยนสถานะห้อง
        console.log('สถานะห้องถูกเปลี่ยนแล้ว');
        // ทำอะไรสักอย่างหลังจากเปลี่ยนสถานะห้อง
      })
      .catch(error => {
        console.error('เกิดข้อผิดพลาดในการเรียกใช้ API:', error);
      });
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    // ทำการดึงข้อมูลสถานะของห้องใน selectedDate และแสดงผลลัพธ์
    // คุณอาจต้องดึงข้อมูลของห้องจากแหล่งที่มาของคุณ และตรวจสอบสถานะของห้องในวันที่เลือก
  };

  return (
    <>
      <Sidebar />
      <div className="centered-container">
        <div className="room-calendar">
          <h2>ปฏิทินสถานะห้อง</h2>
          <Calendar onChange={handleDateChange} value={date} />
          {/* แสดงสถานะของห้องในวันที่ถูกเลือก */}
          {/* คุณสามารถใช้ข้อมูลที่คุณดึงมาเพื่อแสดงสถานะของห้องในปฏิทิน */}
        </div>
      </div>
      <div className="room-manage">
        {Object.keys(roomDataByBranch).map((branch, index) => (
          <div key={index}>
            <h2>สาขา: {branch}</h2>
            <div className="room-grid">
              {roomDataByBranch[branch].map((item, i) => (
                <div key={i} className={`room ${item.room_status}`}>
                  <p>{item.room_number}</p>
                  <button onClick={() => changeRoomStatus(item.room_id)}>
                    เปลี่ยนสถานะ
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
    </>
  );
};

export default Roommanage;