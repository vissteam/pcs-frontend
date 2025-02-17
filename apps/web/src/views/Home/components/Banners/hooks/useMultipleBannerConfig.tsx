import { useCountdown } from '@pancakeswap/hooks'
import shuffle from 'lodash/shuffle'
import { ReactElement, useMemo } from 'react'
import CompetitionBanner from '../CompetitionBanner'
import { GalxeTraverseBanner } from '../GalxeTraverseBanner'
import NewIFOBanner from '../NewIFOBanner'
import PerpetualBanner from '../PerpetualBanner'
import { TopTraderBanner } from '../TopTraderBanner'
import UserBanner from '../UserBanner'
import VeCakeBanner from '../VeCakeBanner'
import WebNotificationBanner from '../WebNotificationBanner'
import useIsRenderCompetitionBanner from './useIsRenderCompetitionBanner'
import useIsRenderIfoBanner from './useIsRenderIFOBanner'
import useIsRenderUserBanner from './useIsRenderUserBanner'

interface IBannerConfig {
  shouldRender: boolean
  banner: ReactElement
}

/**
 * make your custom hook to control should render specific banner or not
 * add new campaign banner easily
 *
 * @example
 * ```ts
 *  {
 *    shouldRender: isRenderIFOBanner,
 *    banner: <IFOBanner />,
 *  },
 * ```
 */

export const useMultipleBannerConfig = () => {
  const isRenderIFOBanner = useIsRenderIfoBanner()
  const isRenderCompetitionBanner = useIsRenderCompetitionBanner()
  const isRenderUserBanner = useIsRenderUserBanner()
  const countdown = useCountdown(1704369600)
  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      {
        shouldRender: true,
        banner: <TopTraderBanner />,
      },
      {
        shouldRender: isRenderUserBanner.shouldRender && !isRenderUserBanner.isEarningsBusdZero,
        banner: <UserBanner />,
      },
      { shouldRender: isRenderIFOBanner || Boolean(countdown), banner: <NewIFOBanner /> },
      { shouldRender: true, banner: <GalxeTraverseBanner /> },
      { shouldRender: true, banner: <WebNotificationBanner /> },
      { shouldRender: true, banner: <VeCakeBanner /> },
    ]

    const SHUFFLE_BANNERS: IBannerConfig[] = [
      {
        shouldRender: isRenderCompetitionBanner,
        banner: <CompetitionBanner />,
      },
      {
        shouldRender: true,
        banner: <PerpetualBanner />,
      },
    ]
    return [
      ...NO_SHUFFLE_BANNERS,
      ...shuffle(SHUFFLE_BANNERS),
      {
        // be the last one if harvest value is zero
        shouldRender: isRenderUserBanner.shouldRender && isRenderUserBanner.isEarningsBusdZero,
        banner: <UserBanner />,
      },
    ]
      .filter((bannerConfig: IBannerConfig) => bannerConfig.shouldRender)
      .map((bannerConfig: IBannerConfig) => bannerConfig.banner)
  }, [
    countdown,
    isRenderCompetitionBanner,
    isRenderIFOBanner,
    isRenderUserBanner.isEarningsBusdZero,
    isRenderUserBanner.shouldRender,
  ])
}
