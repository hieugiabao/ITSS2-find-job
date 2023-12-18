import { FC, useState } from "react";
import { useDebounce } from "use-debounce";
import Home from "../components/Home";
import { useSearchContext } from "../context/search-context";
import { useFetchData } from "../hooks/useFetchData";
import { ICompany } from "../models/Company";
import { IJob } from "../models/Job";
import { ApiResponse, PageResult } from "../types";
import { GetServerSideProps } from "next";
import { getJobsPaginated } from "@/job.service";
import { getCompaniesPaginated } from "@/company.service";
import dbConnect from "@/dbConnect";

export type SearchData = {
  add: string;
  ind: string;
  exp: string;
  sal: string;
};

type Props = {
  jobs: PageResult<IJob> | null;
  companies: PageResult<ICompany> | null;
};

const Index: FC<Props> = ({
  jobs: initialJobs,
  companies: initialCompanies,
}) => {
  const { query } = useSearchContext();
  const [queryDebounce] = useDebounce(query, 500);
  const [jobPage, setJobPage] = useState(1);
  const [companyPage, setCompanyPage] = useState(1);

  // filter
  const [searchData, setSearchData] = useState<SearchData>({
    add: "",
    ind: "",
    exp: "",
    sal: "",
  });

  const [companiesPageData, fetchCompanyLoading, fetchCompanyError] =
    useFetchData<ApiResponse<PageResult<ICompany>>>(
      "/api/companies",
      [companyPage, searchData, queryDebounce],
      {
        params: {
          ...searchData,
          page: companyPage,
          q: queryDebounce,
        },
      },
      initialCompanies === null
    );

  const [jobsPageData, fetchJobLoading, fetchJobError] = useFetchData<
    ApiResponse<PageResult<IJob>>
  >(
    "/api/jobs",
    [jobPage, searchData, queryDebounce],
    {
      params: {
        ...searchData,
        page: jobPage,
        q: queryDebounce,
      },
    },
    initialJobs === null
  );

  const handleChange = (filer: string, value: string | number) => {
    setSearchData({
      ...searchData,
      [filer]: value,
    });
  };

  return (
    <Home
      jobData={jobsPageData?.data?.results ?? initialJobs?.results ?? []}
      setPage={setJobPage}
      totalPages={
        jobsPageData?.data?.totalPages ?? initialJobs?.totalPages ?? 0
      }
      companyData={
        companiesPageData?.data?.results ?? initialCompanies?.results ?? []
      }
      setCompanyPage={setCompanyPage}
      totalCompanyPages={
        companiesPageData?.data?.totalPages ?? initialCompanies?.totalPages ?? 0
      }
      searchData={searchData}
      handleChange={handleChange}
      isError={fetchCompanyError || fetchJobError}
      isLoading={fetchCompanyLoading || fetchJobLoading}
    />
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    await dbConnect();

    const [jobs, companies] = await Promise.all([
      getJobsPaginated({ page: 1, size: 9 }),
      getCompaniesPaginated({ page: 1, size: 3 }),
    ]);
    return {
      props: {
        jobs: jobs ? JSON.parse(JSON.stringify(jobs)) : null,
        companies: companies ? JSON.parse(JSON.stringify(companies)) : null,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        jobs: null,
        companies: null,
      },
    };
  }
};

export default Index;
