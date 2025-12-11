package com.startupxpo.backend.aspect;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class ApiPathLogger {
    private static final Logger logger = LoggerFactory.getLogger(ApiPathLogger.class);
    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerMethods() {}

    @Around("controllerMethods()")
    public Object logApiResponseTime(ProceedingJoinPoint pjp) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object response = pjp.proceed();
        long timeTaken = System.currentTimeMillis() - startTime;
        ServletRequestAttributes attr = (ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attr!=null? attr.getRequest() : null;
        String URI = request.getRequestURI();
        logger.info("Time taken for api {} is {} ms",URI,timeTaken);
        return response;
    }
}
