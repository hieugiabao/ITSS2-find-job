import dbConnect from "@/dbConnect";
import CheckIcon from "@mui/icons-material/Check";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import {
  Avatar,
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
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/navigation";
import React from "react";
import {
  checkIsLike,
  getCommnent,
  getDetailCompany,
  getTotalLike,
} from "../../lib/company.service";
import { getJobsPaginated } from "../../lib/job.service";
import { IComment } from "../../models/Comment";
import { ICompany } from "../../models/Company";
import { IJob } from "../../models/Job";
import Header from "../../components/Header";
import { defaultUser, useUserContext } from "../../context/user-context";

interface CompanyDetailProps {
  company: ICompany;
  totalLike: any;
  comments: IComment[];
  jobs: IJob[];
  isLike: boolean;
}

const COMMENT_ITEMS = 2;
const JOB_ITEMS = 4;

const CompanyDetail = ({
  company,
  totalLike,
  comments,
  jobs,
  isLike,
}: CompanyDetailProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [jobData, setJobData] = React.useState(jobs.slice(0, JOB_ITEMS));

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [anonymous, setAnonymous] = React.useState(0);
  const [likeCount, setLikeCount] = React.useState<number>(
    totalLike?.totalLike ?? 0
  );
  const commentCount = comments.length;
  const [commentData, setCommentData] = React.useState(
    comments.slice(0, COMMENT_ITEMS)
  );
  const timer = React.useRef<number>();
  const [feedBack, setFeedBack] = React.useState({
    comment: "",
    proofUrl: "",
  });
  const [userLiked, setUserLiked] = React.useState(isLike);

  const { user } = useUserContext();

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = async () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      try {
        const res = await axios.post(`/api/companies/${company._id}/comment`, {
          ...feedBack,
          status: "cho duyet",
          company: company._id,
          anonymous,
          user: user?._id,
        });
        if (res.data.success) {
          const newComment = res.data.data as IComment;
          comments.unshift(newComment);
          setCommentData((pre) => [newComment, ...pre]);
        }
        setSuccess(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setOpen(false);
        setSuccess(false);
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoadMoreComment = () => {
    if (commentData.length < commentCount) {
      setCommentData(comments.slice(0, commentData.length + COMMENT_ITEMS));
    }
  };

  const handleLoadMoreJob = () => {
    if (jobData.length < jobs.length) {
      setJobData(jobs.slice(0, jobData.length + JOB_ITEMS));
    }
  };

  const handleLike = async () => {
    const newLikeCount = userLiked ? likeCount - 1 : likeCount + 1;
    setLikeCount(newLikeCount);
    setUserLiked(!userLiked);
    await axios.post(`/api/companies/${company._id}/like`, {
      user: user?._id,
      company: company._id,
    });
  };

  return (
    <div>
      <Header />
      <div className="pt-[8rem] px-28 flex bg-gray-100 min-h-screen gap-9 pb-10">
        <div className="w-[70%]">
          <Box className="bg-white rounded p-7">
            <div className="flex">
              <div className="w-32 h-32 ">
                <img
                  src={company.avatarUrl}
                  alt="company ava"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-14 flex justify-center text-2xl">
                <div className="flex mr-2 justify-center items-center">
                  {likeCount}{" "}
                </div>
                <div className="flex justify-center items-center">
                  <FavoriteIcon
                    className={`${
                      userLiked ? "text-[#FF0000]" : "text-black"
                    } cursor-pointer`}
                    onClick={handleLike}
                  />
                </div>
              </div>
            </div>
            <Typography
              component="div"
              variant="h5"
              className="text-gray-400 mt-3 text-base font-bold"
            >
              {company.companyName} company
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              className="mt-9 font-bold text-black"
            >
              <FmdGoodIcon className="mb-2" />
              {company.address}
            </Typography>
            <div className="mt-2">
              {
                <div
                  dangerouslySetInnerHTML={{
                    __html: String(company.description),
                  }}
                  className="prose prose-lg"
                />
              }
            </div>
          </Box>
          <div className="mt-[2rem] text-2xl">Những công việc đang tuyển</div>
          <div className="flex flex-wrap gap-10 justify-between mt-[2rem]">
            {jobData.length > 0 && (
              <>
                {jobData.map((job) => {
                  const company = job.company as ICompany;
                  return (
                    <Card
                      sx={{ display: "flex", alignItems: "center" }}
                      className="w-[47%] mt-2 cursor-pointer"
                      key={job._id}
                      onClick={() => router.push(`/jobs/${job._id}`)}
                    >
                      <CardMedia
                        component="img"
                        sx={{ width: 100, height: 100, p: 1 }}
                        image={company.avatarUrl}
                        alt="Live from space album cover"
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Typography
                            component="div"
                            variant="h6"
                            className="text-base font-bold"
                          >
                            {job.title}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                          >
                            {company.companyName}
                          </Typography>
                          <div className="flex justify-between pr-6 w-[92%]">
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                              component="div"
                            >
                              {job.salary / 1e6} triệu
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                              component="div"
                              className="truncate w-2/3 text-right"
                            >
                              {company.address}
                            </Typography>
                          </div>
                        </CardContent>
                      </Box>
                    </Card>
                  );
                })}
                {jobData.length !== jobs.length && (
                  <div
                    className="text-[#3448F8] text-lg text-center py-4 cursor-pointer w-full"
                    onClick={handleLoadMoreJob}
                  >
                    Xem thêm...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex-1">
          {!!commentData.length && (
            <div className="bg-white font-bold rounded">
              {commentData.map((comment: any) => (
                <div key={comment._id}>
                  <div className="flex gap-7 px-4 pt-9 pb-5">
                    {comment.anonymous ? (
                      <Avatar
                        sx={{ width: 56, height: 56 }}
                        src={comment?.user?.avatarUrl ?? ""}
                      />
                    ) : (
                      <Avatar sx={{ width: 56, height: 56 }} />
                    )}
                    <div>
                      {comment.anonymous ? (
                        <div className="text-base font-bold">
                          {`${comment?.user?.firstName ?? ""} ${
                            comment?.user?.lastName ?? ""
                          }`}
                        </div>
                      ) : (
                        <div className="">**********</div>
                      )}
                      <p className="text-sm font-normal mt-6">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                  <hr className="h-[2px] bg-black" />
                </div>
              ))}
              {commentData.length !== comments.length && (
                <div
                  className="text-[#A234F8] text-sm text-center pt-6 pb-4 cursor-pointer"
                  onClick={handleLoadMoreComment}
                >
                  Xem thêm...
                </div>
              )}
            </div>
          )}
          <Button
            style={{
              background: "linear-gradient(90deg, #ED57B0 0%, #FC6767 100%)",
            }}
            className="px-8 py-3 h-12 mt-8 mr-14"
            variant="contained"
            onClick={handleClickOpen}
          >
            Đánh giá
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-bold text-2xl">
          Đánh giá công ty
          <div className="my-2 text-base text-gray-400">
            Công ty {company.companyName}
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="min-w-[496px]">
            <label htmlFor="cmt" className="font-bold">
              Comment
            </label>
            <TextField
              fullWidth
              id="cmt"
              className="mt-2"
              placeholder="enter your comment"
              sx={{ backgroundColor: "#D9D9D9" }}
              onChange={(e) =>
                setFeedBack({
                  ...feedBack,
                  comment: e.target.value,
                })
              }
            />
            <label htmlFor="url" className="font-bold my-2 block">
              URL minh chứng
            </label>
            <TextField
              fullWidth
              id="url"
              className="mt-2"
              placeholder="enter your URL"
              sx={{ backgroundColor: "#D9D9D9" }}
              onChange={(e) =>
                setFeedBack({
                  ...feedBack,
                  proofUrl: e.target.value,
                })
              }
            />
          </div>
          <div className="mt-8">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={anonymous}
                onChange={(e) => {
                  setAnonymous(+e.target.value);
                }}
              >
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label={<h1 className="font-bold">Ẩn danh</h1>}
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label={<h1 className="font-bold">Không ẩn danh</h1>}
                />
              </RadioGroup>
            </FormControl>
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
              Đánh giá
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

  const [totalLike, company, comments, jobs, isLike] = await Promise.all([
    getTotalLike(String(params.id)),
    getDetailCompany(String(params.id)),
    getCommnent(String(params.id)),
    getJobsPaginated({ page: 1, size: 4 }, { company: String(params.id) }),
    checkIsLike(String(params.id), defaultUser._id),
  ]);

  if (!company)
    return {
      notFound: true,
    };

  return {
    props: {
      company: JSON.parse(JSON.stringify(company)),
      totalLike: JSON.parse(JSON.stringify(totalLike)),
      comments: JSON.parse(JSON.stringify(comments)),
      jobs: JSON.parse(JSON.stringify(jobs?.results ?? [])),
      isLike,
    },
  };
};

export default CompanyDetail;
