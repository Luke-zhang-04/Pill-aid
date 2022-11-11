import Helmet from "react-helmet"
import type React from "react"

type MetaTagData = {
    title?: string | null
    exactTitle?: boolean
    children?: React.ReactNode
}

/**
 * Dummed-down version of the meta tags component found here:
 * https://github.com/talentmaker/site/blob/master/src/components/metaTags/index.tsx
 */
export const MetaTags: React.FC<MetaTagData> = ({title, exactTitle = false, children}) => {
    const suffix = exactTitle ? "" : " - Pill-AID"

    return <Helmet title={title ? `${title}${suffix}` : undefined}>{children}</Helmet>
}

export const MetaTagsWrapper: React.FC<MetaTagData> = ({children, ...props}) => (
    <>
        <MetaTags {...props} />
        {children}
    </>
)

export default MetaTags
