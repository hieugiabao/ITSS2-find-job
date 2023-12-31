import dbConnect from "@/dbConnect";
import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import axios from "axios";
import { GetServerSideProps } from "next";
import React from "react";
import CompanyList from "../../components/CompanyList";
import Header from "../../components/Header";
import { useUserContext } from "../../context/user-context";
import {
  getCommentedCompaniesByUserId,
  getLikedCompaniesByUserId,
  getUserById,
} from "../../lib/user.service";
import { IAddress } from "../../models/Address";
import { ICompany } from "../../models/Company";
import { IUser } from "../../models/User";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../../components/Editor"), { ssr: false });

interface UserDetailProps {
  user: IUser;
  likedCompanies: ICompany[];
  commentedCompanies: ICompany[];
}

const TABS = {
  like: {
    title: "Danh sách công ty đã like",
    active: "like",
  },
  comment: {
    title: "Danh sách công ty đã đánh giá",
    active: "comment",
  },
};

const UserDetail = ({
  user,
  likedCompanies,
  commentedCompanies,
}: UserDetailProps) => {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState("");
  const [userInfo, setUserInfo] = React.useState({
    address: String((user.address as IAddress)?._id),
    description: user.description,
    username: `${user.firstName} ${user.lastName}`,
  });
  const [avatarUrl, setAvatarUrl] = React.useState(user.avatarUrl);
  const [avatar, setAvatar] = React.useState<File | null>(null);
  const [formUpdate, setFormUpdate] = React.useState(false);
  const { setUser } = useUserContext();
  const [currentTab, setCurrentTab] = React.useState(TABS.like);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSuccess(false);
  };
  const handleCloseFormUpdate = () => {
    setFormUpdate(false);
  };
  const handleOpenFormUpdate = () => {
    setFormUpdate(true);
  };

  const handleSetUserInfo = (key: string, value: string) => {
    setUserInfo({
      ...userInfo,
      [key]: value,
    });
  };

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<number>();

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  React.useEffect(() => {
    return () => {
      if (avatar && avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatar]);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatar(e.target.files?.[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files?.[0]));
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const form = new FormData();
      if (userInfo.username !== "") {
        form.append("username", userInfo.username);
      }
      if (userInfo.address !== "") {
        form.append("address", userInfo.address);
      }
      if (userInfo.description && userInfo.description !== "") {
        form.append("description", userInfo.description);
      }
      if (avatar) {
        form.append("avatar", avatar);
      }
      const response = await axios.post(`/api/users/${user._id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setSuccess(true);
        setUser(response.data.data);
      }
    } catch (e) {
      setSuccess(false);
      console.error(e);
    } finally {
      setLoading(false);
      // set success to false after 2s
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  };

  return (
    <div>
      <Header />
      <div className="pt-[8rem] pb-10 px-28 bg-gray-100 gap-9">
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
                <Typography
                  component="div"
                  variant="h3"
                  className="text-[32px] font-semibold"
                >
                  {`${user.firstName} ${user.lastName}`}
                  <button
                    className="inline-block ml-4 rounded-full hover:bg-slate-200 p-4"
                    onClick={handleOpenFormUpdate}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="35"
                      viewBox="0 0 35 35"
                      fill="none"
                    >
                      <path
                        d="M26.25 0L21.875 4.375L30.625 13.125L35 8.75L26.25 0ZM17.5 8.75L0 26.25V35H8.75L26.25 17.5L17.5 8.75Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  className="mt-4 text-xl"
                >
                  <span className="font-semibold text-black">Email: </span>{" "}
                  {user.email}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  className="mt-2 text-xl"
                >
                  <span className="font-semibold text-black">Địa chỉ: </span>{" "}
                  {(user.address as IAddress).name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  className="mt-3"
                ></Typography>
              </CardContent>
            </Box>
            <div className="flex-1 text-right">
              <Button
                style={{
                  background:
                    "linear-gradient(90deg, #ED57B0 0%, #FC6767 100%)",
                }}
                className="px-8 py-3 h-12 mt-8 mr-14 normal-case text-[18px]"
                variant="contained"
                onClick={handleClickOpen}
              >
                Đăng kí làm mentor
              </Button>
              <Typography
                variant="subtitle1"
                component="div"
                color="#FD0843"
                className="font-semibold mr-14 text-xl mt-4 "
              >
                Phí duy trì : 9.99$/tháng
              </Typography>
            </div>
          </Card>
        </div>
        <div className="flex items-center gap-9 py-10 bg-gray-100">
          {Object.values(TABS).map((tab) => (
            <Button
              style={{
                background:
                  tab.active === currentTab.active ? "#2F80ED" : "#D9D9D9",
              }}
              className="py-2 h-12 mt-8 text-xl text-white normal-case"
              variant="contained"
              key={tab.active}
              onClick={() => setCurrentTab(tab)}
            >
              {tab.title}
            </Button>
          ))}
        </div>
        <CompanyList
          companies={
            currentTab.active === "like" ? likedCompanies : commentedCompanies
          }
          emptyMessage="Chưa có dữ liệu để hiển thị"
        />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {success ? (
          <>
            <DialogTitle
              id="alert-dialog-title"
              className="font-semibold text-2xl text-[#25D908] text-center"
            >
              Gửi thành công !
            </DialogTitle>
            <DialogContent className="flex justify-center flex-col">
              <Typography
                variant="subtitle1"
                component="div"
                color="black"
                className="font-semibold text-2xl my-10 w-[450px] text-center"
              >
                Xin vui lòng đợi admin liên hệ qua email trong vài ngày tới !
              </Typography>
              <hr className="mt-7" />
            </DialogContent>
            <DialogActions className="flex justify-center">
              <Button onClick={handleClose} className="bg-[#E91E63] text-white">
                Ok
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
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
                      setFile(e.target.files?.[0]?.name || "");
                    }}
                  />
                  <div className="flex gap-8">
                    {file && (
                      <span className="font-bold cursor-pointer p-2 bg-[#D9D9D9] block w-[80px] rounded">
                        {file.length > 6 ? `${file.substring(0, 6)}...` : file}
                      </span>
                    )}
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
          </>
        )}
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
          <div className="flex justify-end items-end gap-4">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-[120px] h-[130px] rounded-full shadow-xl border-[1px]"
            />
            <div>
              <label
                htmlFor="avatar"
                className="cursor-pointer"
                title="Chọn file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="44"
                  height="39"
                  viewBox="0 0 44 39"
                  fill="none"
                >
                  <path
                    d="M44 9.625V34.375C44 36.6523 42.1523 38.5 39.875 38.5H4.125C1.84766 38.5 0 36.6523 0 34.375V9.625C0 7.34766 1.84766 5.5 4.125 5.5H11.6875L12.7445 2.67266C13.3461 1.06562 14.8844 0 16.6031 0H27.3883C29.107 0 30.6453 1.06562 31.2469 2.67266L32.3125 5.5H39.875C42.1523 5.5 44 7.34766 44 9.625ZM32.3125 22C32.3125 16.3109 27.6891 11.6875 22 11.6875C16.3109 11.6875 11.6875 16.3109 11.6875 22C11.6875 27.6891 16.3109 32.3125 22 32.3125C27.6891 32.3125 32.3125 27.6891 32.3125 22ZM29.5625 22C29.5625 26.168 26.168 29.5625 22 29.5625C17.832 29.5625 14.4375 26.168 14.4375 22C14.4375 17.832 17.832 14.4375 22 14.4375C26.168 14.4375 29.5625 17.832 29.5625 22Z"
                    fill="black"
                  />
                </svg>
              </label>
              <input
                type="file"
                name=""
                id="avatar"
                hidden
                accept="image/*"
                onChange={handleChangeAvatar}
              />
            </div>
          </div>
          <div className="min-w-[496px]">
            <label htmlFor="name" className="font-bold w-full text-[15px]">
              Tên
            </label>
            <TextField
              fullWidth
              id="name"
              value={userInfo.username}
              className="mt-2"
              placeholder="Nhập tên"
              sx={{ backgroundColor: "#D9D9D9" }}
              onChange={(e) => handleSetUserInfo("username", e.target.value)}
            />
            <label htmlFor="name" className="font-bold my-2 block text-[15px]">
              Nơi ở
            </label>
            <FormControl fullWidth sx={{ backgroundColor: "#D9D9D9" }}>
              <Select
                value={userInfo.address}
                onChange={(e) => handleSetUserInfo("address", e.target.value)}
                placeholder="Chọn thành phố"
              >
                <MenuItem value="">Chọn thành phố</MenuItem>
                <MenuItem value={"1"}>Hà Nội</MenuItem>
                <MenuItem value={"2"}>Hồ Chí Minh</MenuItem>
                <MenuItem value={"3"}>Đà Nẵng</MenuItem>
                <MenuItem value={"4"}>Hải Phòng</MenuItem>
                <MenuItem value={"5"}>Cần Thơ</MenuItem>
                <MenuItem value={"6"}>Biên Hòa</MenuItem>
              </Select>
            </FormControl>
            <label htmlFor="" className="font-bold my-2 block text-[15px]">
              Mô tả
            </label>
            <Editor
              value={userInfo.description ?? ""}
              onChange={(data) => handleSetUserInfo("description", data)}
            />
            <hr className="mt-7" />
          </div>
        </DialogContent>
        <DialogActions className="flex justify-around">
          <Button
            onClick={handleCloseFormUpdate}
            className="bg-[#1E3EE9] text-white"
          >
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
  try {
    await dbConnect();
    if (!params?.id)
      return {
        notFound: true,
      };
    const userId = String(params.id);
    const [user, likedCompanies, commentedCompanies] = await Promise.all([
      getUserById(userId),
      getLikedCompaniesByUserId(userId),
      getCommentedCompaniesByUserId(userId),
    ]);

    if (!user)
      return {
        notFound: true,
      };
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        likedCompanies: JSON.parse(JSON.stringify(likedCompanies)),
        commentedCompanies: JSON.parse(JSON.stringify(commentedCompanies)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

export default UserDetail;
