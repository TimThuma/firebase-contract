import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';

export default props => {
    return (
        <Container>
            <Head>
                <link
                    rel="stylesheet"
                    href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
                />
                <title>Firebase Contract</title>
                <link
                    rel="shortcut icon"
                    type="image/ico"
                    href="../static/favicon.ico"
                />
            </Head>

            <Header />
            {props.children}
        </Container>
    );
};
