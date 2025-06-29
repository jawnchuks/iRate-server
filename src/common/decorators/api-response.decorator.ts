import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath, ApiResponseOptions } from '@nestjs/swagger';
import { BaseResponseDto } from '../dto/base-response.dto';

export const ApiResponse = <TModel extends Type<object>>(
  modelOrOptions: TModel | ApiResponseOptions,
) => {
  if (typeof modelOrOptions === 'function') {
    return applyDecorators(
      ApiExtraModels(BaseResponseDto, modelOrOptions),
      ApiOkResponse({
        description: 'Successful response',
        schema: {
          allOf: [
            { $ref: getSchemaPath(BaseResponseDto) },
            {
              properties: {
                data: {
                  $ref: getSchemaPath(modelOrOptions),
                },
              },
            },
          ],
        },
      }),
    );
  }

  return applyDecorators(ApiOkResponse(modelOrOptions));
};
