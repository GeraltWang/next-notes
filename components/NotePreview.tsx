import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3'])
const allowedAttributes = Object.assign({}, sanitizeHtml.defaults.allowedAttributes, {
  img: ['alt', 'src']
})

interface Props {
  children: string
}

const NotePreview = ({ children }: Props) => {
  return (
    <div className='note-preview'>
      <div
        className='text-with-markdown'
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(marked(children || '') as string, {
            allowedTags,
            allowedAttributes
          })
        }}
      />
    </div>
  )
}

export default NotePreview
