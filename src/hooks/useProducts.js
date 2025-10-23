import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export function useProducts(params = {}) {
    const searchParams = new URLSearchParams()

    if (params.category) searchParams.append('category', params.category)
    if (params.featured) searchParams.append('featured', params.featured)
    if (params.page) searchParams.append('page', params.page)
    if (params.limit) searchParams.append('limit', params.limit)

    const { data, error, isLoading, mutate } = useSWR(
        `/api/products?${searchParams.toString()}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            refreshInterval: 0
        }
    )

    return {
        products: data?.products || [],
        pagination: data?.pagination,
        isLoading,
        isError: error,
        mutate
    }
}

export function useProduct(id) {
    const { data, error, isLoading, mutate } = useSWR(
        id ? `/api/products/${id}` : null,
        fetcher
    )

    return {
        product: data,
        isLoading,
        isError: error,
        mutate
    }
}
