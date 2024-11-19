import { useState } from "react";
import axios from "axios";
import {
  Input,
  message,
  Row,
  Col,
  Card,
  Typography,
  Modal,
  Descriptions,
  Spin,
  Grid,
} from "antd";
import { CloudOutlined, LoadingOutlined } from "@ant-design/icons";
import "./index.css";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

function App() {
  const [cityData, setCityData] = useState<any[]>([]);
  const [cityName, setCityName] = useState("");
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const screens = useBreakpoint();

  const handleSearch = async (cityName: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${
          import.meta.env.VITE_APP_API_KEY
        }`
      );
      message.success("Search Applied");
      if (response.data.length > 0) {
        setCityData(response.data);
      } else {
        setCityData([]);
      }
    } catch (error) {
      setCityData([]);
      // message.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherInfo = async (lat: number, lon: number) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
      import.meta.env.VITE_APP_API_KEY
    }`;
    try {
      const response = await axios.get(url);
      setWeatherInfo(response.data);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch weather info");
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setWeatherInfo(null);
  };

  return (
    <div className="app-container">
      <Title level={2}>Weather App</Title>
      <Input.Search
        placeholder="Search city name..."
        enterButton="Search"
        size="large"
        onSearch={(value) => {
          handleSearch(value);
          setCityName(value);
        }}
        style={{ maxWidth: 400, marginBottom: 20 }}
        allowClear
        onClear={() => {
          setCityData([]);
          setCityName("");
        }}
      />
      {cityName && (
        <>
          <Title level={4}>
            Showing results for{" "}
            <Text style={{ fontSize: "20px" }} strong>
              {cityName}
            </Text>
            :
          </Title>
          <Text className="mb-4">Click one to show weather info</Text>
        </>
      )}
      <Spin
        spinning={isLoading}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        {cityData && cityData.length > 0 && (
          <>
            <Row
              gutter={[16, 16]}
              style={{
                width: "100%",
              }}
              justify={"space-evenly"}
            >
              {cityData.map((item, index) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Card
                    className="city-card"
                    title={
                      <div className="card-title" title={item.name}>
                        {item.name}
                      </div>
                    }
                    bordered={false}
                    hoverable
                    onClick={() => {
                      fetchWeatherInfo(item.lat, item.lon);
                    }}
                    style={{
                      width: screens.xs ? "100%" : "auto",
                    }}
                  >
                    <CloudOutlined className="weather-icon" />
                    <p>Country: {item.country}</p>
                    <p>State: {item.state ?? "-"}</p>
                    <p>Latitude: {item.lat}</p>
                    <p>Longitude: {item.lon}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Spin>

      {weatherInfo && (
        <Modal
          title={`Weather Info for ${weatherInfo.name}`}
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width="90%"
          style={{ maxWidth: "900px" }}
        >
          <div className="modal-content">
            <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
              <Descriptions.Item label="Temperature">
                {weatherInfo.main.temp} K
              </Descriptions.Item>
              <Descriptions.Item label="Feels Like">
                {weatherInfo.main.feels_like} K
              </Descriptions.Item>
              <Descriptions.Item label="Min Temperature">
                {weatherInfo.main.temp_min} K
              </Descriptions.Item>
              <Descriptions.Item label="Max Temperature">
                {weatherInfo.main.temp_max} K
              </Descriptions.Item>
              <Descriptions.Item label="Weather">
                {weatherInfo.weather[0].main} -{" "}
                {weatherInfo.weather[0].description}
              </Descriptions.Item>
              <Descriptions.Item label="Humidity">
                {weatherInfo.main.humidity}%
              </Descriptions.Item>
              <Descriptions.Item label="Wind Speed">
                {weatherInfo.wind.speed} m/s
              </Descriptions.Item>
              <Descriptions.Item label="Wind Direction">
                {weatherInfo.wind.deg}°
              </Descriptions.Item>
              <Descriptions.Item label="Visibility">
                {weatherInfo.visibility} meters
              </Descriptions.Item>
              <Descriptions.Item label="Pressure">
                {weatherInfo.main.pressure} hPa
              </Descriptions.Item>
              <Descriptions.Item label="Sunrise">
                {new Date(weatherInfo.sys.sunrise * 1000).toLocaleTimeString()}
              </Descriptions.Item>
              <Descriptions.Item label="Sunset">
                {new Date(weatherInfo.sys.sunset * 1000).toLocaleTimeString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;
