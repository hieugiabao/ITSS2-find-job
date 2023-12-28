import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { green } from "@mui/material/colors";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { use } from "react";
import Header from "../../components/Header";
import { getUserById,updateUser } from "../../lib/user.service";
import { IAddress } from "../../models/Address";
import { IUser } from "../../models/User";
import dbConnect from "@/dbConnect";
import CreateIcon from '@mui/icons-material/Create';
interface UserDetailProps {
  user: IUser;
}

const UserDetail = ({ user }: UserDetailProps) => {
  const [open, setOpen] = React.useState(false);
  const [like, setLike] = React.useState(true);
  const [comment, setComment] = React.useState(false);
  const [file, setFile] = React.useState("Không");
  const [formUpdate, setFormUpdate] =  React.useState(false);
  let para = {
    name: user?.username,
    des: user?.description,
    addr: user?.address,
    id: user?.id

  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseFormUpdate = () => {
    setFormUpdate(false);
  };
  const handleOpenFormUpdate = () => {
    setFormUpdate(true);
  };
  const handleLike = () => {
    setLike(true);
    setComment(false);
  };

  const handleComment = () => {
    setLike(false);
    setComment(true);
  };

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<number>();

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };
 
  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 3000);
    }
  };
  const handleUpdate=async () => {
    // await fetch('/api/users/65787da5577f298355d4add4', {
    //   method: 'POST',
    //   body: para,
    // })
    setFormUpdate(false);
  }
   
  

  return (
    <div>
      <Header />
      <div className="pt-20 px-28 flex bg-gray-100 gap-9">
        <div className="w-[100%] ">
          <Card sx={{ display: "flex" }} className=" py-6 pl-48">
            <CardMedia
              component="img"
              sx={{ width: 240, p: 4 }}
              image={user.avatarUrl}
              alt="Live from space album cover"
              
              
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h5">
                  {user.username}
                  <IconButton
                     size="large"
                     aria-label="account of current user"
                     aria-controls="primary-search-account-menu"
                     aria-haspopup="true"
                     color="inherit"
                     onClick={handleOpenFormUpdate}
                  >
               <CreateIcon />
               </IconButton>
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  className="mt-2"
                >
                  <span className="font-bold text-black">Email: </span>{" "}
                  {user.email}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  className="mt-2"
                >
                  <span className="font-bold text-black">Địa chỉ: </span>{" "}
                  {(user.address as IAddress).name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  className="mt-3"
                >
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
                onClick={handleClickOpen}
              >
                Đăng Kí làm mentor
              </Button>
            </div>
          </Card>
          
        </div>
       
      </div>
      <div className="grid grid-cols-3 gap-3 pt-10 px-28  bg-gray-100">
      <div >
        {
          like?(
            <Button
              
            style={{
            
              background:
              "blue",
            }}
            className="px-8 py-3 h-12 mt-8 mr-14"
            variant="contained"
            
          >
            Danh sách công ty đã like
          </Button>
             
          ):  <Button
              
          style={{
          
            background:
            "gray",
          }}
          className="px-8 py-3 h-12 mt-8 mr-14"
          variant="contained"
          onClick={handleLike}
        >
          Danh sách công ty đã like
        </Button>
        }
             
       </div>
       <div >
         {
          comment?(
            <Button
            style={{
              background: "blue"
            }}
            className="px-8 py-3 h-12 mt-8 mr-14"
            variant="contained"
              >
            Danh sách công ty đã đánh giá
          </Button>

          ):
          (
            <Button
            style={{
              background: "gray"
            }}
            className="px-8 py-3 h-12 mt-8 mr-14"
            variant="contained"
            onClick={handleComment}
          >
            Danh sách công ty đã đánh giá
          </Button>
          )
         }
             
       </div>
      </div>
     
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-bold text-2xl">
          Nâng cấp mentor
        </DialogTitle>
        <DialogContent>

          <div className="min-w-[496px]">
            <label htmlFor="email" className="font-bold w-full">
              Email
            </label>
            <TextField
              fullWidth
              id="email"
              className="mt-2"
              placeholder="enter your email"
              sx={{ backgroundColor: "#D9D9D9" }}
            />
            <label htmlFor="" className="font-bold my-2 block">
              CV
            </label>
            <div>
              <input
                id="cv"
                className="mt-2"
                placeholder="CV1"
                type="file"
                hidden
                onChange={(e) => {
                  setFile(e.target.files?.[0].name || "Không");
                }}
              />
              <div className="flex gap-8">
                <span className="font-bold cursor-pointer p-2 bg-[#D9D9D9] block w-[80px] rounded">
                  {file.length > 6 ? `${file.substring(0, 6)}...` : file}
                </span>
                <label
                  htmlFor="cv"
                  className="font-bold cursor-pointer p-2 bg-[#D9D9D9] block w-[72px] rounded"
                >
                  Tải lên
                </label>
              </div>
            </div>
          </div>
          <hr className="mt-7" />
        </DialogContent>
        <DialogActions className="flex justify-around">
          <Button onClick={handleClose} className="bg-[#1E3EE9] text-white">
            Hủy
          </Button>
          <Box sx={{ m: 1, position: "relative" }}>
            <Button
              variant="contained"
              className={`${success ? "bg-[#4cf75b]" : "bg-[#E91E63]"}`}
              sx={{
                backgroundColor: "",
              }}
              disabled={loading}
              onClick={handleButtonClick}
            >
              Apply
            </Button>
            {success && (
              <CheckIcon
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                  bgcolor: green[500],
                  borderRadius: "50%",
                }}
              />
            )}
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: green[500],
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
      <Dialog
        open={formUpdate}
        onClose={handleCloseFormUpdate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-bold text-2xl">
          Chỉnh sửa Profile
        </DialogTitle>
        <DialogContent>

          <div className="min-w-[496px]">
            <label htmlFor="name" className="font-bold w-full">
             Tên
            </label>
            <TextField
              fullWidth
              id="name"
              value={user?.username}
              className="mt-2"
              placeholder="enter your username"
              sx={{ backgroundColor: "#D9D9D9" }}
            />
             <label htmlFor="name" className="font-bold my-2 block">
             Nơi ở
            </label>
            <FormControl  fullWidth sx={{backgroundColor: "#D9D9D9"}}>
            <Select 
              
              onChange={(e) => {
             //   para.addr = e.target.value
                console.log("addr",  para.addr )
              }}
              // displayEmpty
              // inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">Tất cả tỉnh / Thành phố</MenuItem>
              <MenuItem value={"1"}>Hà Nội</MenuItem>
              <MenuItem value={"2"}>Hồ Chí Minh</MenuItem>
              <MenuItem value={"3"}>Đà Nẵng</MenuItem>
              <MenuItem value={"4"}>Hải Phòng</MenuItem>
              <MenuItem value={"5"}>Cần Thơ</MenuItem>
              <MenuItem value={"6"}>Biên Hòa</MenuItem>
            </Select>
          </FormControl>
            <label htmlFor="" className="font-bold my-2 block">
              Mô tả
            </label>
            <TextField multiline
            rows={6}
            maxRows={6}
             fullWidth
             id="des"
             className="mt-2 "
             sx={{ backgroundColor: "#D9D9D9" }}
             onChange={(e) => {
              para.des = e.target.value
              console.log("addr",  para.des )
            }}
            />
             </div>
       
        </DialogContent>
        <DialogActions className="flex justify-around">
          <Button onClick={handleCloseFormUpdate} className="bg-[#1E3EE9] text-white">
            Hủy
          </Button>
          <Box sx={{ m: 1, position: "relative" }}>
            <Button
              variant="contained"
              className={`${success ? "bg-[#4cf75b]" : "bg-[#E91E63]"}`}
              sx={{
                backgroundColor: "",
              }}
              disabled={loading}
              onClick={handleUpdate}
            >
             OK
            </Button>
            {success && (
              <CheckIcon
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                  bgcolor: green[500],
                  borderRadius: "50%",
                }}
              />
            )}
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: green[500],
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await dbConnect();
  if (!params?.id)
    return {
      notFound: true,
    };
  const user = await getUserById(String(params.id));
  if (!user)
    return {
      notFound: true,
    };
  return {
    props: { user: JSON.parse(JSON.stringify(user)) },
  };
};

export default UserDetail;
