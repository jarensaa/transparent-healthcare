FROM azul/zulu-openjdk:11
COPY . .
RUN chmod +x wait-for-it.sh
RUN chmod +x ./gradlew
RUN apt-get update
RUN apt-get install dos2unix
RUN dos2unix ./gradlew
RUN dos2unix wait-for-it.sh
RUN ./gradlew
CMD ["./gradlew","bootRun"]