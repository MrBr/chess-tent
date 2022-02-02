import styled from '@emotion/styled';

const Section = styled.div(({ alt }: { alt?: boolean }) => ({
  background: alt ? '#FAFBFB' : '#FFFFFF',
  padding: '120px 0',
}));

export default Section;
