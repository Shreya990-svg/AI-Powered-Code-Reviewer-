import { useState, useEffect } from 'react'
import 'prismjs/themes/prism-tomorrow.css'
import Editor from 'react-simple-code-editor'
import prism from 'prismjs'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`)
  const [review, setReview] = useState("")
  const [typedReview, setTypedReview] = useState("")
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    setTypedReview("")
    const response = await axios.post('http://localhost:3000/ai/get-review', { code })
    const text = response.data || "No review received."
    setReview(text)
  }

  // Typewriter effect
  useEffect(() => {
    if (!review) return
    let i = 0
    const interval = setInterval(() => {
      setTypedReview(prev => prev + review.charAt(i))
      i++
      if (i >= review.length) clearInterval(interval)
    }, 20)
    return () => clearInterval(interval)
  }, [review])

  function toggleTheme() {
    setDarkMode(!darkMode)
    document.body.classList.toggle('light-mode')
  }

  return (
    <>
      <header>
        ⚡ AI Code Reviewer
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={15}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 15,
                color: darkMode ? "#fff" : "#000",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <button onClick={reviewCode} className="review">
            Review
          </button>
        </div>

        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {typedReview}
          </Markdown>
        </div>
      </main>
    </>
  )
}

export default App
