import React from 'react';
import { components, hooks, ui } from '@application';

const { Page, LessonTemplates } = components;
const { useMyLessons, useOpenTemplate } = hooks;
const { Headline4, Text, Container } = ui;

const Templates: React.FC = () => {
  const lessons = useMyLessons();

  const openTemplatePage = useOpenTemplate();

  return (
    <Page>
      <Container className="ps-5 pe-5" fluid>
        <Headline4 className="m-0 mt-4">Templates ✏️</Headline4>
        <Text className="mb-5">Your training and lesson templates.</Text>
        {lessons.value && (
          <LessonTemplates
            lessons={lessons.value}
            onLessonClick={openTemplatePage}
          />
        )}
      </Container>
    </Page>
  );
};

export default Templates;
