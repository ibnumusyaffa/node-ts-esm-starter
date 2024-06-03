import { Request, Response, NextFunction } from "express"
import {
  validationResult,
  ValidationChain,
  FieldValidationError,
} from "express-validator"

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    const arrayOfErrors = errors.array() as FieldValidationError[]
    res.status(422).json({ errors: formatErrors(arrayOfErrors) })
  }
}

function formatErrors(errors: FieldValidationError[]) {
  const formattedErrors = {}
  for (const item of errors) {
    const path = item.path
    if (Object.hasOwn(formattedErrors, path)) {
      formattedErrors[path] = [...formattedErrors[path], item.msg]
      continue
    }
    formattedErrors[path] = [item.msg]
  }

  return formattedErrors
}
