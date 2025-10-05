import { NextResponse } from "next/server"

export function validateField(value, fieldName) {
  if (!value) {
    return NextResponse.json(
      { message: `Missing ${fieldName}` },
      { status: 400 }
    )
  }
  return null
}

export function validateFields(fields) {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return NextResponse.json(
        { message: `Missing ${key}` },
        { status: 400 }
      )
    }
  }
  return null
}
