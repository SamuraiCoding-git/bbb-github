import React from 'react';
import styled from 'styled-components';

const PipeStyled = styled.div`
  width: 50px;
  height: 200px;
  background-color: green;
  position: absolute;
  top: 0;
  left: ${(props) => props.position}px;
`;

const Pipe = ({ position }) => {
    return <PipeStyled position={position} />;
};

export default Pipe;
