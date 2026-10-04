FROM node:26-bookworm-slim AS frontend-build

WORKDIR /src/ClientApp

COPY ClientApp/package.json ClientApp/package-lock.json ./
RUN npm ci

COPY ClientApp/ ./
ENV NG_BUILD_MAX_WORKERS=1
RUN npm run build -- --configuration production

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build

WORKDIR /src

COPY Directory.Build.props UserTaskManagement.sln user-task-management.csproj ./
COPY tests/user-task-management.Tests/user-task-management.Tests.csproj tests/user-task-management.Tests/
RUN dotnet restore UserTaskManagement.sln

COPY . .
COPY --from=frontend-build /src/ClientApp/dist ./ClientApp/dist

RUN dotnet build UserTaskManagement.sln --configuration Release --no-restore
RUN dotnet test UserTaskManagement.sln --configuration Release --no-build --logger "console;verbosity=minimal"
RUN dotnet publish user-task-management.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish \
    -p:SkipClientBuild=true

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

WORKDIR /app
COPY --from=backend-build /app/publish ./

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "user-task-management.dll"]
