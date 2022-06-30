import React, { useState, useCallback, useEffect } from 'react';
import { components, ui, utils } from '@application';
import { Chapter, Lesson } from '@chess-tent/models';
import { RecordValue } from '@chess-tent/redux-record/types';
import styled, { css } from '@chess-tent/styled-props';
import { useMyLessons } from '../hooks/record';

const { Headline5, Text, Modal, Container, Row, Col, Icon, Check, Button } = ui;
const { LessonTemplates } = components;
const { noop } = utils;

interface ChaptersImportProps {
  close: () => void;
  lessons: RecordValue<Lesson[]>;
  onImport: (chapters: Chapter[]) => void;
}

interface ChaptersOptionProps {
  label: string;
  onClick: () => void;
  checked: boolean;
  className?: string;
}

const { className: modalClassName } = css`
  width: 100%;
  max-width: 680px;
`;

const ChapterOption = styled(
  ({ onClick, label, checked, className }: ChaptersOptionProps) => {
    return (
      <Row className={className} onClick={onClick}>
        <Col xs={1}>
          <Check checked={checked} onChange={noop} />
        </Col>
        <Col>
          <Text className="m-0" fontSize="small">
            {label || 'Unnamed chapter'}
          </Text>
        </Col>
      </Row>
    );
  },
).css`
  :last-child {
    border-bottom: 0;
  }
  border-bottom: 1px solid var(--grey-400-color);
  padding: 14px 0;
`;

export const ChaptersImport = ({
  close,
  lessons,
  onImport,
}: ChaptersImportProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>();
  const [chapters, setChapters] = useState<Record<string, Chapter>>({});
  const allSelected =
    !!selectedLesson &&
    selectedLesson.state.chapters.length === Object.keys(chapters).length;

  useEffect(() => {
    // Reset on back
    if (!selectedLesson && Object.keys(chapters).length > 0) {
      setChapters({});
    }
  }, [chapters, selectedLesson]);

  const toggleAllChapters = useCallback(() => {
    if (!selectedLesson) {
      return;
    }
    const { chapters } = selectedLesson.state;

    let newChapters: Record<string, Chapter> = {};
    if (!allSelected) {
      newChapters = chapters.reduce((res, chapter) => {
        res[chapter.id] = chapter;
        return res;
      }, newChapters);
    }

    setChapters(newChapters);
  }, [selectedLesson, allSelected]);

  const toggleChapter = useCallback(
    (newChapter: Chapter) => {
      if (!selectedLesson) {
        return;
      }

      const newChapters = { ...chapters };
      if (newChapters[newChapter.id]) {
        delete newChapters[newChapter.id];
      } else {
        newChapters[newChapter.id] = newChapter;
      }

      setChapters(newChapters);
    },
    [selectedLesson, chapters],
  );

  let content = (
    <>
      <Modal.Header>
        <Container>
          <Headline5>Import chapter</Headline5>
          <Text className="m-0" fontSize="extra-small">
            Reuse chapters from existing templates
          </Text>
        </Container>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <LessonTemplates
            lessons={lessons}
            onLessonClick={setSelectedLesson}
          />
        </Container>
      </Modal.Body>
    </>
  );

  if (selectedLesson) {
    content = (
      <>
        <Modal.Header>
          <Container>
            <Row>
              <Col xs={1}>
                <Icon
                  type="left"
                  onClick={() => setSelectedLesson(undefined)}
                />
              </Col>
              <Col>
                <Headline5>Select chapters</Headline5>
                <Text className="m-0" fontSize="extra-small">
                  Reuse chapters from existing templates
                </Text>
              </Col>
            </Row>
          </Container>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <ChapterOption
              label="Select all"
              onClick={toggleAllChapters}
              checked={allSelected}
            />
            {selectedLesson.state.chapters.map(chapter => (
              <ChapterOption
                key={chapter.id}
                label={chapter.state.title}
                onClick={() => toggleChapter(chapter)}
                checked={!!chapters[chapter.id]}
              />
            ))}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            size="extra-small"
            onClick={() => setChapters({})}
          >
            Clear
          </Button>
          <Button
            variant="primary"
            size="extra-small"
            onClick={() => onImport(Object.values(chapters))}
          >
            Import
          </Button>
        </Modal.Footer>
      </>
    );
  }

  return (
    <Modal show close={close} dialogClassName={modalClassName}>
      {content}
    </Modal>
  );
};

const ChaptersImportContainer = (
  props: Omit<ChaptersImportProps, 'lessons'>,
) => {
  const lessons = useMyLessons();
  return <ChaptersImport lessons={lessons.value} {...props} />;
};

export default ChaptersImportContainer;
