import React from 'react';
import styled from 'styled-components';
import colors from '../../assets/colors';

const Container = styled.div`
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.label`
  position: relative;
  display: block;
  width: 250px;
  border-radius: 6px;
  border: 1px solid ${colors.primary};;
  padding: 15px 8px 15px 10px;
  text-align: left;
`;

const Icon = styled.span`
  position: absolute;
  top: 53%;
  right: 0;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  color: #c5c5c5;
  font-size: 30px;
  color: ${colors.primary};
`;

const Input = styled.input`
  background-color: transparent;
  outline: none;
  border: none;
  color: ${colors.primary};
  font-size: 16px;
`;

interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  placeholder: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, icon, placeholder }) => {  
  return (
    <Container>
      <Label>
        <Icon>
            {icon}
        </Icon>
        <Input
          type="text"
          placeholder= {placeholder}
          autoComplete="off"
          value={value}
          onChange={onChange}
        />
      </Label>
    </Container>
  );
};

export default TextInput;
