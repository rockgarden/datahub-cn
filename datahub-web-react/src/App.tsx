import React from 'react';
import Cookies from 'js-cookie';
import { message } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, ServerError } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { ThemeProvider } from 'styled-components';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './App.less';
import './i18n/config';
import { useTranslation } from 'react-i18next';
import { Routes } from './app/Routes';
import EntityRegistry from './app/entity/EntityRegistry';
import { DashboardEntity } from './app/entity/dashboard/DashboardEntity';
import { ChartEntity } from './app/entity/chart/ChartEntity';
import { UserEntity } from './app/entity/user/User';
import { GroupEntity } from './app/entity/group/Group';
import { DatasetEntity } from './app/entity/dataset/DatasetEntity';
import { DataFlowEntity } from './app/entity/dataFlow/DataFlowEntity';
import { DataJobEntity } from './app/entity/dataJob/DataJobEntity';
import { TagEntity } from './app/entity/tag/Tag';
import { EntityRegistryContext } from './entityRegistryContext';
import { Theme } from './conf/theme/types';
import defaultThemeConfig from './conf/theme/theme_light.config.json';
import { PageRoutes } from './conf/Global';
import { isLoggedInVar } from './app/auth/checkAuthStatus';
import { GlobalCfg } from './conf';
import possibleTypesResult from './possibleTypes.generated';
import { ErrorCodes } from './app/shared/constants';
import CustomThemeProvider from './CustomThemeProvider';
import { useCustomTheme } from './customThemeContext';

/*
    Construct Apollo Client
*/
const httpLink = createHttpLink({ uri: '/api/v2/graphql' });

const errorLink = onError((error) => {
    const { networkError, graphQLErrors } = error;
    if (networkError) {
        const serverError = networkError as ServerError;
        if (serverError.statusCode === ErrorCodes.Unauthorized) {
            isLoggedInVar(false);
            Cookies.remove(GlobalCfg.CLIENT_AUTH_COOKIE);
            const currentPath = window.location.pathname + window.location.search;
            window.location.replace(`${PageRoutes.AUTHENTICATE}?redirect_uri=${encodeURIComponent(currentPath)}`);
        }
    }
    if (graphQLErrors && graphQLErrors.length) {
        const firstError = graphQLErrors[0];
        const { extensions } = firstError;
        const errorCode = extensions && (extensions.code as number);
        // Fallback in case the calling component does not handle.
        message.error(`${firstError.message} (code ${errorCode})`, 3);
    }
});

const client = new ApolloClient({
    connectToDevTools: true,
    link: errorLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    dataset: {
                        merge: (oldObj, newObj) => {
                            return { ...oldObj, ...newObj };
                        },
                    },
                        },
                    },
                },
    }),
    credentials: 'include',
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
        },
    },
});

export const InnerApp: React.VFC = () => {
    return (
        <HelmetProvider>
            <CustomThemeProvider>
                <Helmet>
                    <title>{useCustomTheme().theme?.content.title}</title>
                </Helmet>
                <Router>
                    <Routes />
                        </ApolloProvider>
                    </EntityRegistryContext.Provider>
                </Router>
            </CustomThemeProvider>
        </HelmetProvider>
    );
};

export const App: React.VFC = () => {
    return (
        <ApolloProvider client={client}>
            <InnerApp />
        </ApolloProvider>
    );
};
