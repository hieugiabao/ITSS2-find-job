import React from "react";
import Header from "../../components/Header";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import SquareIcon from "@mui/icons-material/Square";

const JobDetail = () => {
  const [dense, setDense] = React.useState(false);

  const handleChange = () => {
    console.log("change");
  };

  return (
    <div>
      <Header query="" handleChange={handleChange} />
      <div className="pt-20 px-28 flex bg-gray-100 min-h-screen gap-9">
        <div className="w-[75%]">
          <Card sx={{ display: "flex" }} className="h-52">
            <CardMedia
              component="img"
              sx={{ width: 240, p: 1 }}
              image="https://image.bnews.vn/MediaUpload/Org/2019/03/04/151429_01.png"
              alt="Live from space album cover"
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h5">
                  Sun Asterisk
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  className="mt-2"
                >
                  <span className="font-bold text-black">Địa chỉ: </span> 123
                  Hai Bà Trưng, Hà Nội
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  className="mt-3"
                >
                  <span className="font-bold text-black">Mức lương:</span> 15 -
                  20 triệu
                </Typography>
              </CardContent>
            </Box>
            <div className="flex-1 text-right">
              <Button
                style={{
                  background:
                    "linear-gradient(90deg, #ED57B0 0%, #FC6767 100%)",
                }}
                className="px-8 py-3 h-12 mt-8 mr-14"
                variant="contained"
              >
                Apply ngay
              </Button>
            </div>
          </Card>
          <div className="bg-white px-6 mt-6 mb-14 pt-1 rounded shadow">
            <Grid item xs={12} md={6}>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Mô Tả Công Việc:
              </Typography>
              <List dense={dense}>
                <ListItem>
                  <ListItemIcon>
                    <SquareIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Tham gia vào việc phát triển sản phẩm của công ty, lập trình
                front-end, chuyển các file thiết kế (PSD, Figma, Sketch,
                Invision, ...) sang HTML, CSS, iOS, Android"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <SquareIcon />
                  </ListItemIcon>
                  <ListItemText primary="Bảo trì, nâng cấp cho front-end sản phẩm của công ty" />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <SquareIcon />
                  </ListItemIcon>
                  <ListItemText primary="Nghiên cứu và áp dụng các công nghệ mới để tối đa hóa hiệu quả phát triển sản phẩm" />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <SquareIcon />
                  </ListItemIcon>
                  <ListItemText primary="Phối hợp và hỗ trợ với team back-end một cách chủ động và chặt chẽ để nâng cao trải nghiệm người dùng trên từng điểm tiếp xúc" />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Yêu Cầu Công Việc
              </Typography>
              <List dense={dense}>
                <ListItem>
                  <ListItemIcon>
                    <SquareIcon />
                  </ListItemIcon>
                  <ListItemText primary="Kinh nghiệm làm việc tối thiểu 1 năm kinh nghiệm" />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <SquareIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tốt nghiệp các trường Đại học, chuyên ngành CNTT, Điện tử, Viễn thông, ..." />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <SquareIcon />
                  </ListItemIcon>
                  <ListItemText primary="Có hiểu biết về lập trình hướng đối tượng" />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <SquareIcon />
                  </ListItemIcon>
                  <ListItemText primary="Hiểu biết về HTML, CSS, Javascript" />
                </ListItem>
              </List>
            </Grid>
          </div>
        </div>
        <div className="w-[20%]">
          <div className="bg-white p-5 font-bold rounded">
            Việc làm đang tuyển dụng
          </div>
          <Card sx={{ display: "flex" }} className="w-full mt-2">
            <CardMedia
              component="img"
              sx={{ width: 100, height: 100, p: 1 }}
              image="https://image.bnews.vn/MediaUpload/Org/2019/03/04/151429_01.png"
              alt="Live from space album cover"
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography
                  component="div"
                  variant="h6"
                  className="text-base font-bold"
                >
                  Tuyển frontend dev
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  Công ty cổ phần abc
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  10-15 triệu <span className="ml-4">Hà Nội</span>
                </Typography>
              </CardContent>
            </Box>
          </Card>

          <Card sx={{ display: "flex" }} className="w-full mt-2">
            <CardMedia
              component="img"
              sx={{ width: 100, height: 100, p: 1 }}
              image="https://image.bnews.vn/MediaUpload/Org/2019/03/04/151429_01.png"
              alt="Live from space album cover"
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography
                  component="div"
                  variant="h6"
                  className="text-base font-bold"
                >
                  Tuyển frontend dev
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  Công ty cổ phần abc
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  10-15 triệu <span className="ml-4">Hà Nội</span>
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
