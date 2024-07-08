import { Injectable } from '@nestjs/common';
import axios, { type AxiosResponse } from 'axios';
import * as dayjs from 'dayjs';
import { HttpsProxyAgent } from 'https-proxy-agent';
import * as proxies from '../data/proxies.json';

interface ScraperParams {
  propertyId: string;
  endDate?: any;
  page?: number;
  allResults?: ScraperResult['reviews'][0][];
  proxy?: (typeof proxies)[0];
  maxResults?: string;
}

interface ScraperResult {
  reviews: Array<{
    id: string;
    date: string;
    notes: string;
    isMachineTranslated: boolean;
    languageCode: string;
    ownerComment: any;
    groupInformation: {
      groupTypeCode: string;
      age: string;
      tripTypeCodes: Array<string>;
    };
    rating: {
      value: number;
      safety: number;
      location: number;
      staff: number;
      atmosphere: number;
      cleanliness: number;
      facilities: number;
      overall: number;
    };
    user: {
      id: number;
      gender?: {
        value: string;
        id: string;
      };
      nationality: {
        code: string;
        name: string;
      };
      image: any;
      nickname: string;
      numberOfReviews: any;
    };
    liked: any;
    disliked: any;
    recommended: any;
  }>;
  reviewStatistics: {
    positiveCount: number;
    negativeCount: number;
    soloPercentage: number;
    couplesPercentage: number;
    groupsPercentage: number;
  };
  pagination: {
    prev: any;
    next: string;
    numberOfPages: number;
    totalNumberOfItems: number;
  };
}

@Injectable()
export class ReviewsService {
  async scrapeReviews({
    propertyId,
    endDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    page = 1,
    allResults = [],
    proxy = proxies[Math.floor(Math.random() * 10)],
    maxResults = '50',
  }: ScraperParams) {
    console.log('Fetching results with end date ', endDate);
    console.log('Current page ', page);
    console.log('Avail results ', allResults.length);
    const proxyUrl = `http://${proxy.username}:${proxy.password}@${proxy.proxy_address}:${proxy.port}`;
    console.log('Using proxy:', proxyUrl);
    const params = {
      sort: '-date',
      allLanguages: 'true',
      page: page.toString(),
      monthCount: '36',
      application: 'web',
      'per-page': maxResults,
    };
    const qString = new URLSearchParams(params).toString();

    const httpsAgent = new HttpsProxyAgent(proxyUrl);

    const url = `https://prod.apigee.hostelworld.com/legacy-hwapi-service/2.2/properties/${propertyId}/reviews/?${qString}`;
    const result = await axios.get<unknown, AxiosResponse<ScraperResult>>(url, {
      httpsAgent,
      proxy: false,
    });

    const filteredReviews: ScraperResult['reviews'][0][] =
      result.data.reviews.filter((review) =>
        dayjs(review.date).isAfter(dayjs(endDate)),
      );

    allResults.push(...filteredReviews);

    if (result.data.pagination.next && filteredReviews.length > 0) {
      return this.scrapeReviews({
        propertyId,
        endDate,
        page: page + 1,
        allResults,
        proxy: proxies[Math.floor(Math.random() * 10)],
      });
    } else {
      return allResults;
    }
  }
}
