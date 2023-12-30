import React, { FC, useState } from "react";
import Header from "../../components/Header";
import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { useSearchContext } from "../../context/search-context";
import { useDebounce } from "use-debounce";
import { ApiResponse, PageResult } from "../../types";
import { IUser } from "../../models/User";
import { useFetchData } from "../../hooks/useFetchData";
import MentorItem from "../../components/MentorItem";
import { GetServerSideProps } from "next";
import dbConnect from "@/dbConnect";
import { getMentorsPaginated } from "@/user.service";
import categorydata from "../../data/Category.json";

type SearchData = {
  l: string;
  ind: string;
  exp: string;
};

type Props = {
  mentors: PageResult<IUser> | null;
};

const Index: FC<Props> = ({ mentors: initialMentors }) => {
  const { query } = useSearchContext();
  const [queryDebounce] = useDebounce(query, 500);
  const [page, setPage] = useState(1);

  // filter
  const [searchData, setSearchData] = useState<SearchData>({
    l: "",
    ind: "",
    exp: "",
  });

  const [mentorsPageData, isLoading, isError] = useFetchData<
    ApiResponse<PageResult<IUser>>
  >(
    "/api/mentors",
    [page, searchData, queryDebounce],
    {
      params: {
        ...searchData,
        page,
        size: 6,
        q: queryDebounce,
      },
    },
    initialMentors === null
  );

  const mentorsList =
    mentorsPageData?.data?.results ?? initialMentors?.results ?? [];

  const handleChange = (filer: string, value: string | number) => {
    setSearchData({
      ...searchData,
      [filer]: value,
    });
  };

  return (
    <>
      <Header />
      <main className="bg-gray-100 pt-[8rem] min-h-screen">
        <div className="flex mx-28 gap-4 my-3">
          <div className="my-5 text-xl font-extrabold ">Danh sách mentor</div>
          <FormControl sx={{ m: 1, minWidth: 200, backgroundColor: "#fff" }}>
            <Select
              value={`${searchData.ind}`}
              onChange={(e) => {
                handleChange("ind", e.target.value);
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">Tất cả ngành nghề</MenuItem>
              {/* <MenuItem value={"1"}>Sản xuất và chế biến</MenuItem>
              <MenuItem value={"2"}>Kiến trúc và xây dựng</MenuItem>
              <MenuItem value={"3"}>Kinh doanh</MenuItem>
              <MenuItem value={"4"}>Công nghệ - thông tin</MenuItem>
              <MenuItem value={"5"}>Luật - nhân văn</MenuItem>
              <MenuItem value={"6"}>Nghệ thuật - thẩm mỹ - đồ họa</MenuItem> */}
              {categorydata.map((e) => {
                return (
                  <MenuItem key={e._id} value={e._id.toString()}>
                    {e.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 200, backgroundColor: "#fff" }}>
            <Select
              value={`${searchData.exp}`}
              onChange={(e) => {
                handleChange("exp", e.target.value);
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">Tất cả kinh nghiệm</MenuItem>
              <MenuItem value={"0-0"}>Chưa có kinh nghiệm</MenuItem>
              <MenuItem value={"0-1"}>Dưới 1 năm</MenuItem>
              <MenuItem value={"1-1"}>1 năm</MenuItem>
              <MenuItem value={"2-2"}>2 năm</MenuItem>
              <MenuItem value={"3-3"}>3 năm</MenuItem>
              <MenuItem value={"4-20"}>Trên 3 năm</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 200, backgroundColor: "#fff" }}>
            <Select
              value={`${searchData.l}`}
              onChange={(e) => {
                handleChange("l", e.target.value);
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
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
        </div>

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 12 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <p>
            Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để biết thêm thông tin
            chi tiết
          </p>
        )}

        {!isLoading && !isError && (
          <>
            {/* mentors */}
            {mentorsList.length > 0 ? (
              <div className="w-full mx-auto">
                <div className="mx-28 flex flex-wrap gap-2 gap-y-5 mt-10 justify-around">
                  {mentorsList.map((mentor) => (
                    <MentorItem data={mentor} key={mentor._id} />
                  ))}
                </div>
                <div className="mt-6 w-full flex justify-center">
                  <Pagination
                    count={
                      mentorsPageData?.data?.totalPages ??
                      initialMentors?.totalPages ??
                      0
                    }
                    variant="text"
                    color="primary"
                    shape="rounded"
                    className="max-w-[350px]"
                    page={page}
                    onChange={(_e, page) => setPage(page)}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full text-center text-3xl my-10">
                Không có mentor phù hợp
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    await dbConnect();
    const mentorsData = await getMentorsPaginated({
      page: 1,
      size: 6,
    });

    return {
      props: {
        mentors: mentorsData ? JSON.parse(JSON.stringify(mentorsData)) : null,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        mentors: null,
      },
    };
  }
};

export default Index;
