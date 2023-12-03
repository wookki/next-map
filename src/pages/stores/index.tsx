import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import Loader from "@/components/Loader";
import SearchFilter from "@/components/SearchFilter";
import { StoreType } from "@/interface";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { searchState } from "@/atom";

export default function StoreListPage() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null)
  const pageRef = useIntersectionObserver(ref, {})
  const isPageEnd = !!pageRef?.isIntersecting
  const searchValue = useRecoilValue(searchState)


  const fetchStores = async ({ pageParam }: { pageParam: number }) => {
    const { data } = await axios('/api/stores', {
      params: {
        limit: 10,
        page: pageParam,
        ...searchValue
      }
    })

    return data
  }

  const { data: stores, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["stores"],
    queryFn: fetchStores,
    getNextPageParam: (lastPage) => lastPage.data?.length ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  })

  const fetchNext = useCallback(async () => {
    const res = await fetchNextPage()
    if (res.error) {
      console.log(res.error)
    }
  }, [fetchNextPage])


  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined

    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => fetchNext(), 500)

      return () => clearTimeout(timerId)
    }
  }, [isPageEnd, fetchNext, hasNextPage])




  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      <ul role="list" className="divide-y divide-gray-100">
        <SearchFilter />
        {isLoading ? <Loading /> : stores?.pages?.map((page, index) => (
          <Fragment key={index}>
            {page.data.map((store: StoreType, index: number) => (
              <li className="flex justify-between gap-x-6 py-5 cursor-pointer hover:bg-gray-50" key={index} onClick={() => router.push(`/stores/${store.id}`)}>
                <div className="flex gap-x-4">
                  <Image
                    src={
                      store?.category
                        ? `/images/markers/${store?.category}.png`
                        : "/images/markers/default.png"
                    }
                    width={48}
                    height={48}
                    alt="아이콘 이미지"
                  />
                  <div>
                    <div className="text-sm font-semibold leading-6 text-gray-900">
                      {store?.name}
                    </div>
                    <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                      {store?.storeType}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <div className="text-sm font-semibold leading-6 text-gray-900">
                    {store?.address}
                  </div>
                  <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                    {store?.phone || "번호없음"} | {store?.foodCertifyName} |{" "}
                    {store?.category}
                  </div>
                </div>
              </li>
            ))}

          </Fragment>
        ))}
      </ul>
      {(isFetching || hasNextPage || isFetchingNextPage) && < Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} ></div>
    </div >
  );
}