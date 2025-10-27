import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export function useFeaturedOptions() {
    const { data, error, isLoading, mutate } = useSWR(
        '/api/featured-options',
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            refreshInterval: 0
        }
    )

    return {
        featuredOptions: data || [],
        isLoading,
        isError: error,
        mutate
    }
}
