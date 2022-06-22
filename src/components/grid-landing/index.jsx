import React from 'react';
import mountReact from '../../mountReact';
import { Container, H1, H2, UL, Box, BoxTitle } from './styles';

class GridLanding extends React.Component {
  render() {
    return (
      <Container>
        <section className="title">
          <H1>Get started by creating your data view</H1>
          <H2></H2>
        </section>
        <section className="steps">
          <UL>
            <Box>
              <BoxTitle>
                STEP 1
              </BoxTitle>
              <p>
                Select your filters on the left, quickly see what results are available. Most users start with Data Set then Metric
              </p>
            </Box>
            <Box>
              <BoxTitle>
                STEP 2
              </BoxTitle>
              <p>
                Add and remove columns in the top right navigation to see more data levels.
              </p>
            </Box>
          </UL>
        </section>
      </Container>
    );
  }
}

export default mountReact(GridLanding);
