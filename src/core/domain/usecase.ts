export interface UseCase<IRequest = any, IResponse = any> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}
