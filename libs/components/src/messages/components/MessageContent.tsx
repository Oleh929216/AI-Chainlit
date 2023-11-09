import { memo } from 'react';
import { Collapse } from 'src/Collapse';
import { Markdown } from 'src/Markdown';
import { InlinedElements } from 'src/elements/InlinedElements';
import { exportToFile } from 'utils/exportToFile';
import { prepareContent } from 'utils/message';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { IMessageContent } from 'src/types/message';

import { MessageButtons } from './MessageButtons';

const COLLAPSE_MIN_LINES = 25; // Set this to the maximum number of lines you want to display before collapsing
const COLLAPSE_MIN_LENGTH = 3000; // Set this to the maximum number of characters you want to display before collapsing

const MessageContent = memo(
  ({ message, elements, preserveSize }: IMessageContent) => {
    const { preparedContent, inlinedElements, refElements } = prepareContent({
      elements,
      id: message.id,
      content: message.content,
      language: message.language
    });

    const markdownContent = (
      <Typography
        sx={{
          width: '100%',
          minHeight: '20px',
          fontSize: '1rem',
          lineHeight: '1.5rem',
          fontFamily: 'Inter',
          fontWeight: message.authorIsUser ? 500 : 300
        }}
        component="div"
      >
        <Markdown refElements={refElements}>{preparedContent}</Markdown>
      </Typography>
    );

    const lineCount = preparedContent.split('\n').length;
    const collapse =
      lineCount > COLLAPSE_MIN_LINES ||
      preparedContent.length > COLLAPSE_MIN_LENGTH;

    const content = collapse ? (
      <Collapse
        defaultExpandAll={preserveSize}
        onDownload={() => exportToFile(preparedContent, `${message.id}.txt`)}
      >
        {markdownContent}
      </Collapse>
    ) : (
      markdownContent
    );

    return (
      <Stack width="100%" direction="row">
        <Box width="100%">
          {preparedContent ? content : null}
          <InlinedElements elements={inlinedElements} />
        </Box>
        <MessageButtons message={message} />
      </Stack>
    );
  }
);

export { MessageContent };
