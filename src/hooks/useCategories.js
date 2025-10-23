import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export function useCategories() {
    const { data, error, isLoading, mutate } = useSWR(
        '/api/categories',
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            refreshInterval: 0
        }
    )

    return {
        categories: data || [],
        isLoading,
        isError: error,
        mutate
    }
}
