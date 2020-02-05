FROM azul/zulu-openjdk:11
COPY . .
RUN chmod +x wait-for-it.sh
RUN ./gradlew build -x test

FROM azul/zulu-openjdk:11
COPY --from=0 ./build/libs/*.jar app.jar
COPY --from=0 ./wait-for-it.sh .
CMD ["java","-jar","/app.jar"]