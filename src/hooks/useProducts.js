import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

const fetcher = (url) => fetch(url).then((res) => res.json())

export function useProducts(params = {}) {
    const searchParams = new URLSearchParams()

    if (params.category) searchParams.append('category', params.category)
    if (params.featured) searchParams.append('featured', params.featured)
    if (params.status) searchParams.append('status', params.status)
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

export function useInfiniteProducts(params = {}) {
    const limit = params.limit || 12

    const getKey = (pageIndex, previousPageData) => {
        // If previous page returned empty, no more pages
        if (previousPageData && previousPageData.products && previousPageData.products.length === 0) return null

        const searchParams = new URLSearchParams()
        if (params.category) searchParams.append('category', params.category)
        if (params.featured) searchParams.append('featured', params.featured)
        if (params.status) searchParams.append('status', params.status)
        searchParams.append('page', (pageIndex + 1).toString())
        searchParams.append('limit', limit.toString())

        return `/api/products?${searchParams.toString()}`
    }

    const { data, error, isLoading, size, setSize, mutate, isValidating } = useSWRInfinite(getKey, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        refreshInterval: 0
    })

    const pages = data || []
    const flatProducts = pages.flatMap(page => page?.products || [])
    const lastPage = pages[pages.length - 1]
    const pagination = lastPage?.pagination
    const hasMore = pagination ? pagination.page < pagination.pages : true

    return {
        products: flatProducts,
        pages,
        pagination,
        hasMore,
        isLoading,
        isValidating,
        isError: error,
        size,
        setSize,
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
