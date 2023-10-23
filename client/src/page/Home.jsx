import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import './home.css';
import { filterData } from './filterUtils';
import { Column } from '@ant-design/charts'; // เพิ่มการนำเข้า Column จาก Ant Design Charts

function Home() {
  const [dailyBookings, setDailyBookings] = useState([]);
  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedRoomStyle, setSelectedRoomStyle] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://190.92.220.17:7000/api/booking');
        console.log(response.data);
        setData(response.data);

        const nameCounts = {};
        response.data.forEach(item => {
          if (nameCounts[item.name]) {
            nameCounts[item.name] += 1;
          } else {
            nameCounts[item.name] = 1;
          }
        });
        setDailyBookings(nameCounts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // ใช้ setInterval เพื่อเรียกใช้ fetchData() ทุก 30 วินาที
    const intervalId = setInterval(() => {
      fetchData();
    }, 2000);

    return () => {
      // ลบ interval เมื่อคอมโพเนนต์ถูกทำลาย (unmounted)
      clearInterval(intervalId);
    };
  }, []);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
  };

  const handleRoomStyleChange = (roomStyle) => {
    setSelectedRoomStyle(roomStyle);
  };

  // ใช้ฟังก์ชัน filterData เพื่อกรองข้อมูล
  const filteredData = filterData(data, selectedStatus, selectedBranch, selectedRoomStyle);

  // สร้างข้อมูลสำหรับกราฟแท่ง
  const chartData = Object.keys(dailyBookings).map(name => ({
    name,
    value: dailyBookings[name],
  }));

  const chartConfig = {
    data: chartData,
    xField: 'name',
    yField: 'value',
  };

  return (
    <>
      <Sidebar />
      <div className="container">
        <h1 className="dashboard-heading">Dashboard</h1>
        <div className="row">
          <div className="col">
            <div className="card">
              <h2>จำนวนผู้จองในวันนี้: {Object.keys(dailyBookings).length}</h2>
            </div>
          </div>
          <div className="card mt-3">
            <div className="filter-container">
              <label>สถานะ:</label>
              <select value={selectedStatus} onChange={(e) => handleStatusChange(e.target.value)}>
                <option value="all">ทั้งหมด</option>
                <option value="confirmed">ยืนยัน</option>
                <option value="unconfirmed">รอยืนยัน</option>
              </select>

              <label>สาขา:</label>
              <select value={selectedBranch} onChange={(e) => handleBranchChange(e.target.value)}>
                <option value="all">ทั้งหมด</option>
                <option value="1">สาขา 1</option>
                <option value="2">สาขา 2</option>
                {/* เพิ่มตัวกรองอื่น ๆ ตามที่คุณต้องการ */}
              </select>

              <label>รูปแบบห้อง:</label>
              <select value={selectedRoomStyle} onChange={(e) => handleRoomStyleChange(e.target.value)}>
                <option value="all">ทั้งหมด</option>
                <option value="Standard">Standard</option>
                <option value="Middle">Middle</option>
                <option value="Hight">Hight</option>
                {/* เพิ่มตัวกรองอื่น ๆ ตามที่คุณต้องการ */}
              </select>
            </div>

            {/* เพิ่มกราฟแท่ง */}
            <Column {...chartConfig} />
            
            <table className="booking-table">
              <thead>
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">สาขา</th>
                  <th className="table-header">Room Style</th>
                  <th className="table-header">Phone</th>
                  <th className="table-header">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="table-data">{item.name}</td>
                    <td className="table-data">{item.branch}</td>
                    <td className="table-data">{item.roomstyle}</td>
                    <td className="table-data">{item.phone}</td>
                    <td className={`table-data ${item.status_booking === 0 ? 'unconfirmed' : 'confirmed'}`}>
                      {item.status_booking === 0 ? 'รอยืนยัน' : 'ยืนยัน'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
