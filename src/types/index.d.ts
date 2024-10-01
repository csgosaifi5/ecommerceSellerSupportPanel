type PropsWithClassName = {
    className?: string
}

declare module "@splidejs/react-splide" {
    import { ReactNode } from "react"

    // Define a generic component type.
    export type SplideComponent<T = {}> = React.ComponentType<T>

    // Define the SplideProps interface.
    export interface SplideProps {
        options?: SplideOptions
        hasSliderWrapper?: boolean
        children?: ReactNode
        [key: string]: any // Allow any other props
    }

    // Define the SplideSlideProps interface.
    export interface SplideSlideProps {
        children?: ReactNode
        [key: string]: any // Allow any other props
    }

    // Define the SplideOptions interface (you should adjust this according to your needs).
    export interface SplideOptions {
        // Add the options you want to use.
        arrows?: boolean
        perPage?: number
        gap?: string | number
        type?: string
        pagination?: boolean,
        speed?: number,
        autoplay?: boolean,
        [key: string]: any
    }

    // Export the Splide and SplideSlide components.
    export const SplideTrack: SplideComponent<SplideProps>
    export const Splide: SplideComponent<SplideProps>
    export const SplideSlide: SplideComponent<SplideSlideProps>
}


