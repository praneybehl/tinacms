/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import * as React from 'react'
import Link from 'next/link'
import { loadMarkdown, useMarkdownForm } from '@tinacms/next-tinacms-markdown'
import { render } from '@testing-library/react'
import {useCMS, useCMSForm, useWatchFormValues} from "react-tinacms"

export default function Page(props) {

  let cms = useCMS()

  let [post, form] = useCMSForm({
    id: props.fileRelativePath,
    label: "blogpost",
    initialValues: {
      title: props.title
    },
    fields: [
      {
        name: "title",
        component: "text"
      }
    ],
  })

  let writeToDisk = React.useCallback(formState => {
    cms.api.git.writeToDisk({
      fileRelativePath: props.fileRelativePath,
      content: JSON.stringify({title: formState.values.title})
    })
  }, [])

  useWatchFormValues(form, writeToDisk)

  return (
    <>
      <h1>{post.title}</h1>
    </>
  )
}

Page.getInitialProps = function(ctx) {
  const { slug } = ctx.query
  let content = require(`../posts/${slug}.json`)

  return {
    slug: slug,
    fileRelativePath: `/posts/${slug}.json`,
    title: content.title
  }
}