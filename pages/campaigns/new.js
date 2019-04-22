import React, { Component } from 'react';
import {
    Form,
    Button,
    Input,
    Message,
    Label,
    TextArea,
    Segment
} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import assert from 'assert';
import { loadFirebase } from '../../lib/db';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false,
        title: '',
        description: '',
        titlen: 0,
        deslen: 0
    };

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        //FIREBASE STUFF START!

        let firebase = await loadFirebase();
        let db = firebase.firestore();
        let data;
        let documId;

        await db
            .collection('contracts')
            .get()
            .then(snapshot => {
                documId =
                    snapshot.docs[
                        Math.round(Math.random() * (snapshot.docs.length - 1))
                    ].id;
            });

        let docum = db.collection('contracts').doc(documId);

        await docum.get().then(doc => {
            data = {
                address: doc.data().address.repeat(2),
                balance: doc.data().balance.repeat(2)
            };
        });

        db.collection('contracts').add(data);

        //FIREBASE STUFF END!

        try {
            assert(this.state.minimumContribution > 0);

            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(
                    this.state.minimumContribution,
                    this.state.title,
                    this.state.description
                )
                .send({
                    from: accounts[0]
                });

            Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>

                <Form
                    onSubmit={this.onSubmit}
                    error={!!this.state.errorMessage}
                >
                    <Segment>
                        <Form.Field>
                            <label>Campaign Title</label>
                            <Label
                                color={
                                    this.state.titlen <= 50 ? 'green' : 'red'
                                }
                                ribbon="right"
                            >
                                {this.state.titlen} / 50
                            </Label>
                            <Input
                                value={this.state.title}
                                onChange={event =>
                                    this.setState({
                                        title: event.target.value,
                                        titlen: event.target.value.length
                                    })
                                }
                            />
                        </Form.Field>
                    </Segment>

                    <Segment>
                        <Form.Field>
                            <label>Campaign Description</label>
                            <Label
                                color={
                                    this.state.deslen <= 200 ? 'green' : 'red'
                                }
                                ribbon="right"
                            >
                                {this.state.deslen} / 200
                            </Label>
                            <TextArea
                                value={this.state.description}
                                onChange={event =>
                                    this.setState({
                                        description: event.target.value,
                                        deslen: event.target.value.length
                                    })
                                }
                            />
                        </Form.Field>
                    </Segment>

                    <Segment>
                        {' '}
                        <Form.Field>
                            <label>Minimum Contribution</label>
                            <Input
                                //type="number"
                                label="wei"
                                labelPosition="right"
                                value={this.state.minimumContribution}
                                onChange={event =>
                                    this.setState({
                                        minimumContribution: event.target.value
                                    })
                                }
                            />
                        </Form.Field>
                    </Segment>

                    <Message
                        error
                        header="Oops!"
                        content={this.state.errorMessage}
                    />
                    <Button loading={this.state.loading} primary>
                        Create!
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;
