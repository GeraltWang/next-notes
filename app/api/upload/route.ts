import { importNode } from '@/lib/actions/notes.action'
import { getErrorMessage } from '@/lib/utils'
import dayjs from 'dayjs'
import { mkdir, stat, writeFile } from 'fs/promises'
import mime from 'mime'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { join } from 'path'

export async function POST(request: Request) {
  // get formData
  const formData = await request.formData()
  // get file from formData
  const file = formData.get('file') as File

  // 空值判断
  if (!file) {
    return NextResponse.json({ error: 'File is required.' }, { status: 400 })
  }

  // 读取文件内容
  const buffer = Buffer.from(await file.arrayBuffer())
  const relativeUploadDir = `/uploads/${dayjs().format('YY-MM-DD')}`
  const uploadDir = join(process.cwd(), 'public', relativeUploadDir)

  // 确保文件上传的目录存在。如果目录不存在，则创建它；如果在尝试访问或创建目录时遇到其他错误，则捕获这些错误并适当处理
  try {
    await stat(uploadDir)
  } catch (e) {
    const error = e as NodeJS.ErrnoException
    if (error.code === 'ENOENT') {
      await mkdir(uploadDir, { recursive: true })
    } else {
      console.error(e)
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
    }
  }

  try {
    const uniqueSuffix = `${Math.random().toString(36).slice(-6)}`
    const filename = file.name.replace(/\.[^/.]+$/, '')
    const uniqueFilename = `${filename}-${uniqueSuffix}.${mime.getExtension(file.type)}`

    // 调用接口，写入数据库
    const { noteId } = await importNode({
      title: filename,
      content: buffer.toString('utf-8')
    })

    // 写入文件
    await writeFile(`${uploadDir}/${uniqueFilename}`, buffer)

    // 清除缓存
    revalidatePath('/', 'layout')

    return NextResponse.json({ fileUrl: `${relativeUploadDir}/${uniqueFilename}`, noteId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: getErrorMessage(e) || 'Something went wrong.' }, { status: 500 })
  }
}
