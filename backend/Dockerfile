FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY Itinera.API ./Itinera.API/
COPY Itinera.Core ./Itinera.Core/
COPY Itinera.Infrastructure ./Itinera.Infrastructure/
COPY Itinera.sln .

RUN dotnet restore --verbosity detailed
RUN dotnet publish Itinera.API/Itinera.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5192
ENTRYPOINT ["dotnet", "Itinera.API.dll"]

